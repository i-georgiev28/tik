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
import { Alarm, RID } from "@/types";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from '@expo/vector-icons/FontAwesome';

type AlarmListProps = {
  style?: StyleProp<ViewStyle>
}

const AlarmList = ({style}: AlarmListProps) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://10.0.2.2:3000/robot/${RID}/alarm`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch alarms: ${response.status}`);
        }
        
        const alarmsData: Alarm[] = await response.json();
        
        // Sort alarms by id from largest to smallest (assuming `id` is a number)
        alarmsData.sort((a, b) => {
          // If `id` is numeric, compare them as numbers
          return b.id! - a.id!;
        });

        setAlarms(alarmsData);
        setAlarms(alarmsData);
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
      Icon={<AntDesign name="moon" size={22} color="#8d8e8c" />}
      Button={
        <Pressable>
          <Entypo name="plus" size={22} color="#8d8e8c" />
        </Pressable>
      }
      title={"SLEEP"}
      data={alarms}
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


interface AlarmCardProps {
  alarm: Alarm;
  // onToggle?: (enabled: boolean) => void;
  // onPress?: () => void;
}


export const AlarmItem =  ({alarm}: AlarmCardProps) => {
    const [enabled, setEnabled] = useState(!!alarm.enabled);
    // const handleToggle = (newValue: boolean) => {
        // onToggle?.(newValue);
    // };

    const cardStyle = [
        styles.card,
        { backgroundColor: enabled ? '#ececec' : '#e3e3e1' },
      ];
    
      const taskStyle = [
        styles.task,
        { backgroundColor: enabled ? 'rgba(230, 125, 182, 0.2)' : '#d3d6d5' },
      ];
    
      const switchColor = {
        trackColor: {
          false: '#999b9d',
          true: theme.primary,
        },
        thumbColor: enabled ? '#fff' : '#ccc',
        ios_backgroundColor: "#3e3e3e",
      };
    
      const formatDaysOfWeek = () => {
    
        const dayAbbreviations = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const dayValues = [
          alarm.days.mon,
          alarm.days.tue,
          alarm.days.wed,
          alarm.days.thu,
          alarm.days.fri,
          alarm.days.sat,
          alarm.days.sun,
        ];
    
        return dayAbbreviations.map((abbr, index) => (
          <Text
            key={abbr + index}
            style={[
              styles.textSmall,
              {color: dayValues[index] ? '#df82ba' : '#8d8e8c' },
              {fontWeight: dayValues[index] ? '500' : '400' }
            ]}
          >
            {abbr}{' '}
          </Text>
        ));
      };
      const swipeableRef = useRef<any>(null);
const toggleSwitch = () => {
  setEnabled((previousState) => {
    const newState = !previousState;
    return newState;
  });
};      const handlePress = () => {
        // @ts-ignore
        swipeableRef.current?.openLeft();
      };

    return (
        <GestureHandlerRootView>
                <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={LeftAction}
      leftThreshold={40}
    enableTrackpadTwoFingerGesture
    >
    <Pressable
      style={cardStyle}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={{display: 'flex', flexDirection: 'row' }}>
          {formatDaysOfWeek()}
        </View>

        <Text style={styles.textLarge}>{alarm.time}</Text>

        <View style={taskStyle}>
          <Text style={{ color: '#000', fontWeight: '700', fontSize: 12 }}>TASK</Text>
        </View>
      </View>

      <View style={styles.switchContainer}>
            <Pressable
      style={{ height: '100%', width: '35%', justifyContent: 'center'}}
      onPress={toggleSwitch}
    >
        <Switch
          disabled={true}
          trackColor={switchColor.trackColor}
          thumbColor={switchColor.thumbColor}
          ios_backgroundColor={'#fff'}
          value={enabled}
          onValueChange={toggleSwitch}
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
        </Pressable>
      </View>
    </Pressable>
    </Swipeable>
        </GestureHandlerRootView>
    );

};

const styles = StyleSheet.create({
  card: {
    height: 150,
    // marginHorizontal: 5,
    // marginVertical: 1,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  textSmall: {
    // fontFamily: 'Helvetica Now Display',
    // fontWeight: '500',
    fontWeight: '800',
    color: '#8d8e8c',
    fontSize: 11,
    letterSpacing: 3.2,
    marginBottom: -2,
  },
  textLarge: {
    color: '#000',
    fontSize: 54,
    fontFamily: 'Helvetica Now Display',
    fontWeight: '500',
  },
  task: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  switchContainer: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
});


function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - 80 }],
      opacity: drag.value * 0.1,
    };
    });

  return (
    <Reanimated.View style={styleAnimation}>
      <View style={{ width: 80, height: '100%', backgroundColor: theme.primary,     borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <FontAwesome name="trash" size={32} color="white" />
        </View>
    </Reanimated.View>
  );
}

export default AlarmList;








// const alarms: Alarm[] = [
//   {
//     enabled: true,
//     time: '06:30',
//     tag: 'TASK',
//     days: {
//       mon: true,
//       tue: true,
//       wed: true,
//       thu: true,
//       fri: true,
//       sat: false,
//       sun: false,
//     },
//   },
//   {
//     enabled: false,
//     time: '07:15',
//     tag: 'TASK',
//     days: {
//       mon: false,
//       tue: true,
//       wed: true,
//       thu: true,
//       fri: true,
//       sat: false,
//       sun: false,
//     },
//   },
//   {
//     enabled: true,
//     time: '08:00',
//     tag: 'TASK',
//     days: {
//       mon: true,
//       tue: false,
//       wed: true,
//       thu: false,
//       fri: true,
//       sat: false,
//       sun: true,
//     },
//   },
//   {
//     enabled: true,
//     time: '09:00',
//     tag: 'TASK',
//     days: {
//       mon: true,
//       tue: true,
//       wed: false,
//       thu: false,
//       fri: true,
//       sat: true,
//       sun: false,
//     },
//   },
//   {
//     enabled: false,
//     time: '10:45',
//     tag: 'TASK',
//     days: {
//       mon: false,
//       tue: false,
//       wed: true,
//       thu: true,
//       fri: false,
//       sat: true,
//       sun: false,
//     },
//   },
//   {
//     enabled: true,
//     time: '11:30',
//     tag: 'TASK',
//     days: {
//       mon: false,
//       tue: false,
//       wed: false,
//       thu: true,
//       fri: true,
//       sat: true,
//       sun: true,
//     },
//   },
//   {
//     enabled: false,
//     time: '12:00',
//     tag: 'TASK',
//     days: {
//       mon: false,
//       tue: false,
//       wed: false,
//       thu: false,
//       fri: false,
//       sat: false,
//       sun: true,
//     },
//   },
//   {
//     enabled: true,
//     time: '14:15',
//     tag: 'TASK',
//     days: {
//       mon: true,
//       tue: false,
//       wed: false,
//       thu: true,
//       fri: true,
//       sat: false,
//       sun: false,
//     },
//   },
//   {
//     enabled: true,
//     time: '18:00',
//     tag: 'TASK',
//     days: {
//       mon: true,
//       tue: true,
//       wed: true,
//       thu: true,
//       fri: true,
//       sat: true,
//       sun: true,
//     },
//   },
//   {
//     enabled: false,
//     time: '23:59',
//     tag: 'TASK',
//     days: {
//       mon: false,
//       tue: false,
//       wed: false,
//       thu: false,
//       fri: false,
//       sat: false,
//       sun: false,
//     },
//   },
// ];