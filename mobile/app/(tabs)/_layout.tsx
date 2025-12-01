/**
 * Tabs Layout
 *
 * Main tab navigation with native performance optimizations
 *
 * Tabs:
 * - Today (Dashboard)
 * - Members
 * - Tasks
 * - Profile
 */

import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Users, CheckSquare, User } from 'lucide-react-native';

import { colors } from '@/constants/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Tab bar styling
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        // Performance optimizations
        lazy: false, // Pre-mount all tabs
        freezeOnBlur: true, // Freeze inactive tabs (90% CPU reduction)
        animation: 'none', // Instant switching
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.today'),
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: t('members.title'),
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: t('tasks.title'),
          tabBarIcon: ({ color, size }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
