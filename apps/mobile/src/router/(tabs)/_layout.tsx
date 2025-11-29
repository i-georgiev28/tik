// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const title = route.name === 'index' ? 'Home' : 'Alarms';

        return (
          <Pressable
            key={route.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {title}
            </Text>
            {isFocused && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />} // 👈 Attach here
    >
      <Tabs.Screen
        name="index"
        // options={{
        //   title: 'Home',
        //   tabBarLabel: ({ focused }) => (
        //     <Text style={{ color: focused ? 'black' : 'gray' }}>
        //       Home
        //     </Text>
        //   ),
        // }}
      />
      <Tabs.Screen
        name="alarms"
        // options={{
        //   title: 'Alarms',
        //   tabBarLabel: ({ focused }) => (
        //     <Text style={{ color: focused ? 'black' : 'gray' }}>
        //       Alarms
        //     </Text>
        //   ),
        // }}
      />
    </Tabs>
  );
}




const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    // backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  activeLabel: {
    color: '#000',
    fontWeight: '600',
  },
  indicator: {
    width: 24,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginTop: 4,
  },
});