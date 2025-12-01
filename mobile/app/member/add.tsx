/**
 * Add Member Screen
 *
 * Production-grade form with validation, photo upload, and smooth UX
 * Uses NativeWind for styling
 */

import React, { useState, useCallback, useRef } from 'react';
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
import { router } from 'expo-router';
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
} from 'lucide-react-native';

import { useCreateMember } from '@/hooks/useMembers';
import { useAuthStore } from '@/stores/auth';
import { colors } from '@/constants/theme';
import { haptics } from '@/constants/interaction';
import type { CreateMemberRequest } from '@/types';

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

const initialFormState: FormState = {
  name: { value: '', touched: false },
  phone: { value: '', touched: false },
  email: { value: '', touched: false },
  address: { value: '', touched: false },
  birthDate: { value: '', touched: false },
  gender: { value: '', touched: false },
  maritalStatus: { value: '', touched: false },
  notes: { value: '', touched: false },
};

// ============================================================================
// VALIDATION
// ============================================================================

function validateName(value: string): string | undefined {
  if (!value.trim()) return 'Name is required';
  if (value.length < 2) return 'Name must be at least 2 characters';
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value) return undefined; // Optional
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  if (!phoneRegex.test(value)) return 'Invalid phone number';
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value) return undefined; // Optional
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

export default function AddMemberScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const createMember = useCreateMember();

  const [form, setForm] = useState<FormState>(initialFormState);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Update field
  const updateField = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], value, touched: true },
    }));
  }, []);

  // Touch field (for blur validation)
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
      t('addMember.photo') || 'Profile Photo',
      t('addMember.photoOptions') || 'Choose an option',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('addMember.takePhoto') || 'Take Photo', onPress: handleTakePhoto },
        { text: t('addMember.choosePhoto') || 'Choose from Library', onPress: handlePickPhoto },
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
    if (!validateForm()) {
      haptics.error();
      return;
    }

    haptics.tap();

    const memberData: CreateMemberRequest = {
      name: form.name.value.trim(),
      campus_id: user?.campus_id || '',
      phone: form.phone.value.trim() || undefined,
      address: form.address.value.trim() || undefined,
      birth_date: form.birthDate.value || undefined,
      gender: (form.gender.value as 'M' | 'F') || undefined,
      marital_status: form.maritalStatus.value || undefined,
      notes: form.notes.value.trim() || undefined,
    };

    try {
      await createMember.mutateAsync(memberData);
      haptics.success();
      router.back();
    } catch (error) {
      haptics.error();
      Alert.alert(
        t('common.error'),
        t('addMember.errorCreating') || 'Failed to create member. Please try again.'
      );
    }
  }, [form, user, createMember, validateForm, t]);

  const genderOptions = [
    { label: t('addMember.genderOptions.male') || 'Male', value: 'M' },
    { label: t('addMember.genderOptions.female') || 'Female', value: 'F' },
  ];

  const maritalOptions = [
    { label: t('addMember.maritalOptions.single') || 'Single', value: 'single' },
    { label: t('addMember.maritalOptions.married') || 'Married', value: 'married' },
    { label: t('addMember.maritalOptions.widowed') || 'Widowed', value: 'widowed' },
    { label: t('addMember.maritalOptions.divorced') || 'Divorced', value: 'divorced' },
  ];

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
              {t('addMember.title') || 'Add Member'}
            </Text>
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
                    {t('addMember.addPhoto') || 'Add Photo'}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <FormInput
              label={t('addMember.fields.name') || 'Full Name'}
              icon={User}
              value={form.name.value}
              error={validateName(form.name.value)}
              touched={form.name.touched}
              placeholder={t('addMember.placeholders.name') || 'Enter full name'}
              onChangeText={(text) => updateField('name', text)}
              onBlur={() => touchField('name')}
              autoCapitalize="words"
              required
            />

            <FormInput
              label={t('addMember.fields.phone') || 'Phone Number'}
              icon={Phone}
              value={form.phone.value}
              error={validatePhone(form.phone.value)}
              touched={form.phone.touched}
              placeholder={t('addMember.placeholders.phone') || '+62 812 3456 7890'}
              onChangeText={(text) => updateField('phone', text)}
              onBlur={() => touchField('phone')}
              keyboardType="phone-pad"
            />

            <FormInput
              label={t('addMember.fields.email') || 'Email'}
              icon={Mail}
              value={form.email.value}
              error={validateEmail(form.email.value)}
              touched={form.email.touched}
              placeholder={t('addMember.placeholders.email') || 'email@example.com'}
              onChangeText={(text) => updateField('email', text)}
              onBlur={() => touchField('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label={t('addMember.fields.address') || 'Address'}
              icon={MapPin}
              value={form.address.value}
              touched={form.address.touched}
              placeholder={t('addMember.placeholders.address') || 'Enter address'}
              onChangeText={(text) => updateField('address', text)}
              onBlur={() => touchField('address')}
              multiline
            />

            <SelectInput
              label={t('addMember.fields.gender') || 'Gender'}
              icon={Users}
              value={form.gender.value}
              options={genderOptions}
              placeholder={t('addMember.placeholders.gender') || 'Select gender'}
              onSelect={(value) => updateField('gender', value)}
            />

            <SelectInput
              label={t('addMember.fields.maritalStatus') || 'Marital Status'}
              icon={Users}
              value={form.maritalStatus.value}
              options={maritalOptions}
              placeholder={t('addMember.placeholders.maritalStatus') || 'Select status'}
              onSelect={(value) => updateField('maritalStatus', value)}
            />

            <FormInput
              label={t('addMember.fields.notes') || 'Notes'}
              icon={FileText}
              value={form.notes.value}
              touched={form.notes.touched}
              placeholder={t('addMember.placeholders.notes') || 'Additional notes...'}
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
              createMember.isPending ? 'bg-primary-300' : 'bg-primary-500 active:bg-primary-600'
            }`}
            onPress={handleSubmit}
            disabled={createMember.isPending}
          >
            {createMember.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {t('addMember.submit') || 'Create Member'}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
