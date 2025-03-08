import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Enable native screens implementation
enableScreens(true);

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { 
                backgroundColor: '#fff',
                // Disable safe area padding on web
                ...Platform.select({
                  web: {
                    paddingTop: 0,
                    paddingBottom: 0,
                  },
                }),
              },
              animation: Platform.select({
                native: 'fade',
                web: undefined, // Disable animation on web to prevent issues
              }),
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
                animation: Platform.select({
                  native: 'fade',
                  web: undefined,
                }),
              }} 
            />
            <Stack.Screen 
              name="+not-found" 
              options={{ 
                title: 'Oops!',
                presentation: 'modal',
              }} 
            />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}