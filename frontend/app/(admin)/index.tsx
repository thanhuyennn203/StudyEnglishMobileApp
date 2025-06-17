import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function AdminScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Admin Panel</Text>
      <Button mode="contained" style={{ marginBottom: 16 }} onPress={() => router.push('/topics')}>
        Manage Topics
      </Button>
      <Button mode="contained" onPress={() => router.push('/words')}>
        Manage Words
      </Button>
      <Button mode="outlined" onPress={handleLogout} style={{ marginTop: 24 }}>
        Logout
      </Button>
    </View>
  );
}
