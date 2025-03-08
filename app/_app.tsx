import { Platform } from 'react-native';
import { useEffect } from 'react';
import { initDatabase } from '@/services/database';

// Initialize gesture handler for web platform
if (Platform.OS === 'web') {
  require('./gesture-handler.web');
}

export default function App({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the database when the app starts
    initDatabase().catch(error => {
      console.error('Database initialization error:', error);
    });
  }, []);

  return children;
}