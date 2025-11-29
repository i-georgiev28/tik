import { Pressable, StyleSheet, Text, View } from 'react-native';

type CustomTabBarProps = {
  state: {
    routes: { name: string }[];
    index: number;
  };
  navigation: {
    navigate: (name: string) => void;
  };
};

export default function TabBar({ state, navigation }: CustomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return (
          <Pressable
            key={route.name}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text style={[styles.text, isFocused && styles.active]}>
              {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#999',
    fontSize: 14,
  },
  active: {
    color: '#000',
    fontWeight: '600',
  },
});