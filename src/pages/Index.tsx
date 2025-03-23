import React from 'react';
import ChatLayout from '@/components/chat/ChatLayout';
import { useThemeStore } from '@/store/themeStore';
import { useThemeEffect } from '@/hooks/useThemeEffect';

const Index: React.FC = () => {
  const { theme } = useThemeStore();
  useThemeEffect(theme);

  return <ChatLayout />;
};

export default Index;
