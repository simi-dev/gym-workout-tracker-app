import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, History, User, Dumbbell } from 'lucide-react-native'; // Updated Chrome to Home
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 1,
              borderTopColor: '#e2e8f0',
              height: Platform.OS === 'ios' ? 88 : 60,
              paddingBottom: Platform.OS === 'ios' ? 28 : 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: '#3b82f6',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarShowLabel: true,
            tabBarLabelStyle: {
              fontSize: 12,
            },
            headerShadowVisible: false,
            headerTitleAlign: 'center',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
              headerTitle: 'Gym Workout Tracker',
            }}
          />
          <Tabs.Screen
            name="workouts"
            options={{
              title: 'Workouts',
              tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />,
              headerTitle: 'My Workouts',
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
              headerTitle: 'Workout History',
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
              headerTitle: 'My Profile',
            }}
          />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}