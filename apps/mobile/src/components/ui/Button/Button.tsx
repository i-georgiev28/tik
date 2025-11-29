import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { getButtonStyles } from './Button.styles';
import { ButtonProps } from './Button.types';

const Button = ({
  children,
  variant = 'capsule',
  size = 'md',
  disabled = false,
  onPress,
  style,
  textStyle,
  ...touchableProps
}: ButtonProps) => {
  const styles = getButtonStyles(variant, size, disabled);

  // Development warning for missing children
  if (process.env.NODE_ENV !== 'production' && !children) {
    console.warn('Button component requires children. Please provide content for the button.');
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...touchableProps}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyle]} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;