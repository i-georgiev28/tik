import { ViewStyle, View, Text, ScrollView, StyleProp } from "react-native";
import { GestureHandlerRootView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Switch, Pressable } from 'react-native';
import theme from "@/styles/theme";
import List from "@/components/ui/List/List";
import { AlarmItem } from "../AlarmList/AlarmList";
import { Alarm, RID } from "@/types";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Button from "@/components/ui/Button";

type ReminderListProps = {
  style?: StyleProp<ViewStyle>
}

const ReminderList = ({style}: ReminderListProps) => {
  const [reminders, setReminders] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://10.0.2.2:3000/robot/${RID}/reminder`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch alarms: ${response.status}`);
        }
        
        const alarmsData: Alarm[] = await response.json();
        setReminders(alarmsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching alarms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, []); // Empty dependency array means this runs once on mount

  if (loading || error) return (undefined);

  return (
    <List 
      style={style}
      Icon={<Ionicons name="alarm" size={22} color="#8d8e8c" />}
      Button={
        <Pressable>
          <Entypo name="plus" size={22} color="#8d8e8c" />
        </Pressable>
      }
      title={"SLEEP"}
      data={reminders}
      renderItem={(item, index) => <AlarmItem alarm={item} />}
    />
  );

    // return(
    //     <View style={style}>
    // <View
    //   style={{
    //     display: 'flex',
    //     flexDirection: 'row',
    //     paddingHorizontal: 10,
    //     paddingVertical: 20,
    //   }}
    // >
    //   <Text
    //     style={{
    //       // fontFamily: 'Zurich Regular',
    //       paddingLeft: 15, //TODO: Add icon
    //       color: '#8d8e8c',
    //       fontSize: 16,
    //       letterSpacing: -0.5,
    //       fontWeight: '700',
    //     }}
    //   >
    //     SLEEP
    //   </Text>
    // </View>
    // <ScrollView indicatorStyle={"white"} style={{
    //   display: 'flex', flexDirection: 'column',
    //   paddingHorizontal: 5,
    //   borderRadius: 10}}
    // contentContainerStyle={{
    //  gap: 2
    // }}>
    //   <AlarmItem alarm={example}/>
    //   <AlarmItem alarm={example2}/>
    //   <AlarmItem alarm={example2}/>
    //   <AlarmItem alarm={example2}/>
    //   <AlarmItem alarm={example2}/>
    // </ScrollView>
    //     </View>
    // )
};

export default ReminderList;