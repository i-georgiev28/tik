import type { TextProps, ViewProps } from 'react-native';
import React from 'react';

export interface HeaderProps extends ViewProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  children?: React.ReactNode;
}

export interface BackButtonProps {
  onPress?: () => void;
}