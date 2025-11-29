import { StyleSheet } from 'react-native';

import type { TextStyle, ViewStyle } from 'react-native';
import type { ButtonSize, ButtonVariant } from './Button.types';

const BASE = {
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  } satisfies ViewStyle,

  text: {
    color: '#ffffff',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
    display: 'flex',
  } satisfies TextStyle,
};


const SIZE = {
  sm: {
    container: {
      paddingHorizontal: 12,
      paddingVertical: 3,
    } satisfies ViewStyle,
    text: {
      fontSize: 12,
    } satisfies TextStyle,
  },
  md: {
    container: {
      paddingHorizontal: 16,
      paddingVertical: 5,
    } satisfies ViewStyle,
    text: {
      fontSize: 13,
    } satisfies TextStyle,
  },
  lg: {
    container: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    } satisfies ViewStyle,
    text: {
      fontSize: 16,
    } satisfies TextStyle,
  },
};

export const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, disabled: boolean) => {
  const sizeConfig = SIZE[size] || SIZE.md;
  const backgroundColor = variant === 'ghost' ? 'rgba(0,0,0,0)' : BASE.container.backgroundColor;
  return StyleSheet.create({
    container: {
      ...BASE.container,
      ...sizeConfig.container,
      ...(disabled ? { opacity: 0.5 } : {}),
      backgroundColor
    },
    text: {
      ...BASE.text,
      ...sizeConfig.text,
    },
  });
};