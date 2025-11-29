import Header from "@/components/layout/Header";
import AlarmList from "@/components/feature/AlarmList/AlarmList";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReminderList from "@/components/feature/ReminderList/ReminderList";


export default function AlarmScreen() {
  const alarms = undefined;
  return (
    <SafeAreaView style={{
      paddingTop: '10%',
      flexDirection: 'column',
      gap: 24,
      height: '100%'
    }}>
      <Header title="ALARMS">
          <Button onPress={() => {router.push('/modal')}}>EDIT</Button>
      </Header>
            <View style={{ flex: 1, height: '100%', gap: 10, alignItems: 'center', marginHorizontal: 10 }}>
              <AlarmList
                // data={alarms}
                style={{
                  borderRadius: 10,
                  flex: 2, // <-- 3 parts
                  paddingBottom: 5,
                  overflow: 'hidden',
                }}
              />
              <ReminderList
                // data={alarms}
                style={{
                  borderRadius: 10,
                  flex: 1.2, // <-- 1 part
                  // marginHorizontal: 10,
                  paddingBottom: 5,
                  overflow: 'hidden',
                }}
              />
            </View>
    </SafeAreaView>
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Text>Alarms</Text>
    //             <Button
    //   title="Open Modal"
    //   onPress={() => router.push('/modal')}
    // />
    // </View>
  );
}
