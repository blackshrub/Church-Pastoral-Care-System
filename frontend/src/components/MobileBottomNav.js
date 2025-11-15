import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BarChart3, MoreHorizontal } from 'lucide-react';

export const MobileBottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const navigation = [
    {
      name: t('dashboard'),
      href: '/dashboard',
      icon: Home,
      testId: 'nav-dashboard'
    },
    {
      name: t('members'),
      href: '/members',
      icon: Users,
      testId: 'nav-members'
    },
    {
      name: t('calendar'),
      href: '/calendar',
      icon: Calendar,
      testId: 'nav-calendar'
    },
    {
      name: t('analytics'),
      href: '/analytics',
      icon: BarChart3,
      testId: 'nav-analytics'
    },
    {
      name: t('more'),
      href: '/settings',
      icon: MoreHorizontal,
      testId: 'nav-more'
    }
  ];
  
  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === href;
  };
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 sm:hidden"
      data-testid="mobile-bottom-nav"
    >
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={
                `flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                  active 
                    ? 'text-teal-600' 
                    : 'text-gray-600 hover:text-teal-500'
                }`
              }
              data-testid={item.testId}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
