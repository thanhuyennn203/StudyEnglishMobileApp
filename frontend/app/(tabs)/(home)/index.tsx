import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const seen = await AsyncStorage.getItem('onboardingComplete');
      console.log('🧠 onboardingComplete =', seen);
      if (seen === 'true') {
        console.log('➡️ Redirecting to HOME');
        router.replace('/(tabs)/(home)/home');
      } else {
        console.log('➡️ Redirecting to ONBOARDING');
        router.replace('/(tabs)/(home)/onboarding');
      }
    };
    check().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
