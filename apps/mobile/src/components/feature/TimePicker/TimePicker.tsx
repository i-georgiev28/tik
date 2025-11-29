import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import WheelPicker, { withPickerControl, usePickerControl, useOnPickerValueChangedEffect } from '@quidone/react-native-wheel-picker';
import { styles } from './TimePicker.styles';
import type { TimePickerProps } from './TimePicker.types';

const ControlPicker = withPickerControl(WheelPicker);

const hours = Array.from({ length: 24 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }));
const minutes = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }));

type PickerMap = {
  hour: { item: { value: number } };
  minute: { item: { value: number } };
};

const DEFAULT_WIDTH = 90;
const DEFAULT_VISIBLE_ITEM_COUNT = 7;

const TimePicker = ({ value = { hour: 0, minute: 0 }, setValue, onChange, disabled }: TimePickerProps) => {
  // const [time, setTime] = useState(value);
  const pickerControl = usePickerControl<PickerMap>();

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  useOnPickerValueChangedEffect(pickerControl, (event: any) => {
    const newValue = {
      hour: (event?.pickers?.hour?.item?.value as number) ?? 0,
      minute: (event?.pickers?.minute?.item?.value as number) ?? 0,
    };
    setValue(newValue);
    // onChange?.(newValue);
  });

  return (
    <View style={styles.container}>
      <ControlPicker
        control={pickerControl}
        pickerName="hour"
        data={hours}
        value={value.hour}
        width={DEFAULT_WIDTH}
        visibleItemCount={DEFAULT_VISIBLE_ITEM_COUNT}
        enableScrollByTapOnItem={!disabled}
        itemTextStyle={styles.text}
      />

      <Text style={styles.label}>:</Text>

      <ControlPicker
        control={pickerControl}
        pickerName="minute"
        data={minutes}
        value={value.minute}
        width={DEFAULT_WIDTH}
        visibleItemCount={DEFAULT_VISIBLE_ITEM_COUNT}
        enableScrollByTapOnItem={!disabled}
        itemTextStyle={styles.text}
      />

    </View>
  );
};

export default TimePicker;
