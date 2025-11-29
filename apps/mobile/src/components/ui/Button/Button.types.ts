import { type PropsWithChildren } from 'react';
import { type TextStyle, type TouchableOpacityProps, type ViewStyle } from 'react-native';


export type ButtonVariant = 'capsule' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps extends Omit<TouchableOpacityProps, 'style' | 'onPress'> {
  /**
   * The visual style variant of the button
   * @default 'capsule'
   */
  variant?: ButtonVariant;

  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when button is pressed
   */
  onPress?: (() => void);

  /**
   * Additional container styling
   */
  style?: ViewStyle;

  /**
   * Additional text content styling
   */
  textStyle?: TextStyle;
}

export type ButtonProps = PropsWithChildren<BaseButtonProps>;