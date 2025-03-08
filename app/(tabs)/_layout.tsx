import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Chrome as Home, History, User, Dumbbell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            // ... your existing screenOptions
          }}
        >
          {/* Your Tabs.Screen components */}
          <Tabs.Screen name="index" options={{ /* ... */ }} />
          <Tabs.Screen name="workouts" options={{ /* ... */ }} />
          <Tabs.Screen name="history" options={{ /* ... */ }} />
          <Tabs.Screen name="profile" options={{ /* ... */ }} />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}