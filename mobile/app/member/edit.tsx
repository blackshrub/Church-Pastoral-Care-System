/**
 * Edit Member Screen
 *
 * Production-grade edit form with photo upload and validation
 * Uses NativeWind for styling
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  FileText,
  Check,
  AlertCircle,
  ChevronDown,
  Trash2,
} from 'lucide-react-native';

import { useMember, useUpdateMember, useDeleteMember } from '@/hooks/useMembers';
import { colors } from '@/constants/theme';
import { haptics } from '@/constants/interaction';
import type { Member } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

interface FormState {
  name: FormField;
  phone: FormField;
  email: FormField;
  address: FormField;
  birthDate: FormField;
  gender: FormField;
  maritalStatus: FormField;
  notes: FormField;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateName(value: string): string | undefined {
  if (!value.trim()) return 'Name is required';
  if (value.length < 2) return 'Name must be at least 2 characters';
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value) return undefined;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  if (!phoneRegex.test(value)) return 'Invalid phone number';
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value) return undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Invalid email address';
  return undefined;
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface FormInputProps {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
  error?: string;
  touched: boolean;
  placeholder: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  required?: boolean;
}

function FormInput({
  label,
  icon: Icon,
  value,
  error,
  touched,
  placeholder,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  required = false,
}: FormInputProps) {
  const showError = touched && error;

  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">
          {label}
          {required && <Text className="text-error-500"> *</Text>}
        </Text>
      </View>
      <View
        className={`flex-row items-start bg-white rounded-xl border-2 px-4 ${
          showError ? 'border-error-300' : 'border-gray-100'
        } ${multiline ? 'py-3' : ''}`}
      >
        <View className={`mr-3 ${multiline ? 'mt-0.5' : 'mt-3'}`}>
          <Icon size={20} color={showError ? colors.error[400] : colors.gray[400]} />
        </View>
        <TextInput
          className={`flex-1 text-base text-gray-900 ${multiline ? 'min-h-[100px]' : 'h-12'}`}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {showError && (
          <View className="mt-3">
            <AlertCircle size={18} color={colors.error[500]} />
          </View>
        )}
      </View>
      {showError && (
        <Animated.Text
          entering={FadeIn.duration(200)}
          className="text-xs text-error-500 mt-1.5 ml-1"
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

interface SelectInputProps {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
  options: { label: string; value: string }[];
  placeholder: string;
  onSelect: (value: string) => void;
  required?: boolean;
}

function SelectInput({
  label,
  icon: Icon,
  value,
  options,
  placeholder,
  onSelect,
  required = false,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">
          {label}
          {required && <Text className="text-error-500"> *</Text>}
        </Text>
      </View>
      <Pressable
        className="flex-row items-center bg-white rounded-xl border-2 border-gray-100 px-4 h-12"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Icon size={20} color={colors.gray[400]} />
        <Text
          className={`flex-1 text-base ml-3 ${
            selectedOption ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown
          size={20}
          color={colors.gray[400]}
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>
      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          className="bg-white rounded-xl border border-gray-100 mt-2 overflow-hidden shadow-lg"
        >
          {options.map((option, index) => (
            <Pressable
              key={option.value}
              className={`flex-row items-center px-4 py-3 ${
                index < options.length - 1 ? 'border-b border-gray-100' : ''
              } ${value === option.value ? 'bg-primary-50' : 'active:bg-gray-50'}`}
              onPress={() => {
                haptics.tap();
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              <Text
                className={`flex-1 text-base ${
                  value === option.value ? 'text-primary-600 font-medium' : 'text-gray-900'
                }`}
              >
                {option.label}
              </Text>
              {value === option.value && <Check size={18} color={colors.primary[500]} />}
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

// ============================================================================
// MAIN SCREEN
// ============================================================================

export default function EditMemberScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: member, isLoading: isMemberLoading } = useMember(id || '');
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();

  const [form, setForm] = useState<FormState>({
    name: { value: '', touched: false },
    phone: { value: '', touched: false },
    email: { value: '', touched: false },
    address: { value: '', touched: false },
    birthDate: { value: '', touched: false },
    gender: { value: '', touched: false },
    maritalStatus: { value: '', touched: false },
    notes: { value: '', touched: false },
  });
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Populate form when member data loads
  useEffect(() => {
    if (member) {
      setForm({
        name: { value: member.name || '', touched: false },
        phone: { value: member.phone || '', touched: false },
        email: { value: '', touched: false },
        address: { value: member.address || '', touched: false },
        birthDate: { value: member.birth_date || '', touched: false },
        gender: { value: member.gender || '', touched: false },
        maritalStatus: { value: member.marital_status || '', touched: false },
        notes: { value: member.notes || '', touched: false },
      });
      setPhotoUri(member.photo_url || null);
    }
  }, [member]);

  // Update field
  const updateField = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], value, touched: true },
    }));
  }, []);

  // Touch field
  const touchField = useCallback((field: keyof FormState) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], touched: true },
    }));
  }, []);

  // Pick photo
  const handlePickPhoto = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      haptics.success();
    }
  }, []);

  // Take photo
  const handleTakePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.error'), 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      haptics.success();
    }
  }, [t]);

  // Show photo picker options
  const handlePhotoPress = useCallback(() => {
    haptics.tap();
    Alert.alert(
      t('editMember.photo') || 'Profile Photo',
      t('editMember.photoOptions') || 'Choose an option',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('editMember.takePhoto') || 'Take Photo', onPress: handleTakePhoto },
        { text: t('editMember.choosePhoto') || 'Choose from Library', onPress: handlePickPhoto },
      ]
    );
  }, [t, handleTakePhoto, handlePickPhoto]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const nameError = validateName(form.name.value);
    const phoneError = validatePhone(form.phone.value);
    const emailError = validateEmail(form.email.value);

    setForm((prev) => ({
      ...prev,
      name: { ...prev.name, error: nameError, touched: true },
      phone: { ...prev.phone, error: phoneError, touched: true },
      email: { ...prev.email, error: emailError, touched: true },
    }));

    return !nameError && !phoneError && !emailError;
  }, [form]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!validateForm() || !id) {
      haptics.error();
      return;
    }

    haptics.tap();

    const memberData: Partial<Member> = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim() || undefined,
      address: form.address.value.trim() || undefined,
      birth_date: form.birthDate.value || undefined,
      gender: (form.gender.value as 'M' | 'F') || undefined,
      marital_status: form.maritalStatus.value || undefined,
      notes: form.notes.value.trim() || undefined,
    };

    try {
      await updateMember.mutateAsync({ memberId: id, data: memberData });
      haptics.success();
      router.back();
    } catch (error) {
      haptics.error();
      Alert.alert(
        t('common.error'),
        t('editMember.errorUpdating') || 'Failed to update member. Please try again.'
      );
    }
  }, [form, id, updateMember, validateForm, t]);

  // Handle delete
  const handleDelete = useCallback(() => {
    Alert.alert(
      t('editMember.deleteTitle') || 'Delete Member',
      t('editMember.deleteConfirm') || 'Are you sure you want to delete this member? This action cannot be undone.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await deleteMember.mutateAsync(id);
              haptics.success();
              router.replace('/(tabs)/members');
            } catch (error) {
              haptics.error();
              Alert.alert(t('common.error'), 'Failed to delete member');
            }
          },
        },
      ]
    );
  }, [id, deleteMember, t]);

  const genderOptions = [
    { label: t('editMember.genderOptions.male') || 'Male', value: 'M' },
    { label: t('editMember.genderOptions.female') || 'Female', value: 'F' },
  ];

  const maritalOptions = [
    { label: t('editMember.maritalOptions.single') || 'Single', value: 'single' },
    { label: t('editMember.maritalOptions.married') || 'Married', value: 'married' },
    { label: t('editMember.maritalOptions.widowed') || 'Widowed', value: 'widowed' },
    { label: t('editMember.maritalOptions.divorced') || 'Divorced', value: 'divorced' },
  ];

  if (isMemberLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View
          className="bg-white border-b border-gray-100 px-4"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row items-center h-14">
            <Pressable
              className="w-10 h-10 rounded-full items-center justify-center active:bg-gray-100"
              onPress={() => {
                haptics.tap();
                router.back();
              }}
            >
              <ArrowLeft size={24} color={colors.gray[700]} />
            </Pressable>
            <Text className="flex-1 text-lg font-semibold text-gray-900 ml-2">
              {t('editMember.title') || 'Edit Member'}
            </Text>
            <Pressable
              className="w-10 h-10 rounded-full items-center justify-center active:bg-error-50"
              onPress={handleDelete}
            >
              <Trash2 size={20} color={colors.error[500]} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo Upload */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="items-center mb-8"
          >
            <Pressable
              className="w-28 h-28 rounded-full bg-white border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden active:opacity-90"
              onPress={handlePhotoPress}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Camera size={32} color={colors.gray[400]} />
                  <Text className="text-xs text-gray-400 mt-1">
                    {t('editMember.addPhoto') || 'Add Photo'}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <FormInput
              label={t('editMember.fields.name') || 'Full Name'}
              icon={User}
              value={form.name.value}
              error={validateName(form.name.value)}
              touched={form.name.touched}
              placeholder={t('editMember.placeholders.name') || 'Enter full name'}
              onChangeText={(text) => updateField('name', text)}
              onBlur={() => touchField('name')}
              autoCapitalize="words"
              required
            />

            <FormInput
              label={t('editMember.fields.phone') || 'Phone Number'}
              icon={Phone}
              value={form.phone.value}
              error={validatePhone(form.phone.value)}
              touched={form.phone.touched}
              placeholder={t('editMember.placeholders.phone') || '+62 812 3456 7890'}
              onChangeText={(text) => updateField('phone', text)}
              onBlur={() => touchField('phone')}
              keyboardType="phone-pad"
            />

            <FormInput
              label={t('editMember.fields.address') || 'Address'}
              icon={MapPin}
              value={form.address.value}
              touched={form.address.touched}
              placeholder={t('editMember.placeholders.address') || 'Enter address'}
              onChangeText={(text) => updateField('address', text)}
              onBlur={() => touchField('address')}
              multiline
            />

            <SelectInput
              label={t('editMember.fields.gender') || 'Gender'}
              icon={Users}
              value={form.gender.value}
              options={genderOptions}
              placeholder={t('editMember.placeholders.gender') || 'Select gender'}
              onSelect={(value) => updateField('gender', value)}
            />

            <SelectInput
              label={t('editMember.fields.maritalStatus') || 'Marital Status'}
              icon={Users}
              value={form.maritalStatus.value}
              options={maritalOptions}
              placeholder={t('editMember.placeholders.maritalStatus') || 'Select status'}
              onSelect={(value) => updateField('maritalStatus', value)}
            />

            <FormInput
              label={t('editMember.fields.notes') || 'Notes'}
              icon={FileText}
              value={form.notes.value}
              touched={form.notes.touched}
              placeholder={t('editMember.placeholders.notes') || 'Additional notes...'}
              onChangeText={(text) => updateField('notes', text)}
              onBlur={() => touchField('notes')}
              multiline
            />
          </Animated.View>

          <View className="h-24" />
        </ScrollView>

        {/* Submit Button */}
        <View
          className="bg-white border-t border-gray-100 px-6 py-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            className={`h-14 rounded-xl items-center justify-center ${
              updateMember.isPending ? 'bg-primary-300' : 'bg-primary-500 active:bg-primary-600'
            }`}
            onPress={handleSubmit}
            disabled={updateMember.isPending}
          >
            {updateMember.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {t('editMember.submit') || 'Save Changes'}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
