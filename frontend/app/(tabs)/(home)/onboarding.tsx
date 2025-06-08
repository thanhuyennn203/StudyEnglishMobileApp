import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  const finish = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    console.log('onboardingComplete set to true');
    router.replace('/(tabs)/(home)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.desc}>This onboarding shows only once.</Text>
      <TouchableOpacity onPress={finish} style={styles.btn}>
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  btn: { backgroundColor: '#3F51B5', padding: 12, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: 'bold' },
});
