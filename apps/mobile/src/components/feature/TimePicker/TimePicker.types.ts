export type TimePickerValue = {
  hour: number;
  minute: number;
};

/**
 * Simplified props: only the value and change handler are required for this
 * niche, non-modular time picker. We keep `disabled` as an optional flag.
 */
export type TimePickerProps = {
  onChange?: (newValue: TimePickerValue) => void;
  value?: TimePickerValue;
  setValue: (time: TimePickerValue) => void;
  disabled?: boolean;
};
