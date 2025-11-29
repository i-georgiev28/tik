import React, { useState } from 'react';
import { Text, View } from "react-native";
import TimePicker from "@/components/feature/TimePicker/TimePicker";
import OptionsList from "../components/feature/OptionsList/OptionsList";
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Alarm, RID } from '@/types';



export default function HomeScreen() {
  
  const getCurrentTime = () => {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
};

  const [time, setTime] = useState(getCurrentTime);

  const  formatTime = (time: any): string => {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}
const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    // Fill missing data with placeholder
    const newAlarm: Alarm = {
      enabled: true,
      time: formatTime(time),
      tag: 'TASK', // placeholder tag
      days: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      },
    };

    try {
      const response = await fetch(`http://10.0.2.2:3000/robot/${RID}/alarm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlarm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create alarm');
      }

      const savedAlarm: Alarm = await response.json();
      console.log('Alarm saved:', savedAlarm);

      // Navigate back to alarms list
      router.replace('/(tabs)/alarms');
    } catch (err) {
      console.error('Error saving alarm:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{
      height: '100%',
      paddingTop: '35%',
      gap: 24,
      flexDirection: 'column'
    }}>
        <Header showBackButton onBackPress={() => {router.replace('/(tabs)/alarms')}} title="ALARM">
          <Button onPress={handleSave}>SAVE</Button>
        </Header>
      <View style={{
        marginHorizontal: 8,
        gap: 24,
        display: 'flex',
        flex: 1,
        // backgrou<ndColor: '#d5d5d5',
        alignItems: 'center'
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#797e7f',
          borderRadius: '100%',
          width: '100%',
          height: 390
        }}>
          <TimePicker value={time} value={time} setValue={setTime} />
        </View>
        <OptionsList />
      </View>
    </SafeAreaView>
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Text style={{ marginBottom: 12 }}>Select a time:</Text>
    //   <TimePicker value={time} onChange={setTime} />
    //   <Text style={{ marginTop: 12 }}>Selected: {formattedTime}</Text>
    // </View>
  );
}
