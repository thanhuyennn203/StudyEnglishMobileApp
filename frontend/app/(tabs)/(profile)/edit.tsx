import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Avatar, Chip, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, tokens, setUser } = useAuth();
  const API_URL = "http://10.0.2.2:5130/api/auth";

  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || '');
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  const [email] = React.useState(user?.email || '');

  // Add image picker handler
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setSnackbarMsg('Permission to access media library is required!');
      setSnackbarVisible(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // For now, just use the local URI. For production, upload to server and get a URL.
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update profile fields
      const res = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: tokens?.accessToken ? `Bearer ${tokens.accessToken}` : '',
        },
        body: JSON.stringify({
          displayName,
          avatarUrl,
        }),
      });
      if (!res.ok) throw new Error('Profile update failed');
      const updatedUser = await res.json();
      setUser((prev) => ({ ...prev, ...updatedUser }));
      // Optionally update password
      if (showPasswordFields && password && oldPassword) {
        const passRes = await fetch(`${API_URL}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: tokens?.accessToken ? `Bearer ${tokens.accessToken}` : '',
          },
          body: JSON.stringify({ oldPassword, newPassword: password }),
        });
        if (!passRes.ok) throw new Error('Password change failed');
      }
      setSnackbarMsg('Profile updated!');
      setSnackbarVisible(true);
      setIsSaving(false);
      setTimeout(() => router.back(), 1200);
    } catch (e) {
      setSnackbarMsg('Update failed.');
      setSnackbarVisible(true);
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{ uri: avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={{ marginBottom: 12 }}
        />
        <Button mode="text" onPress={pickImage} style={{ marginBottom: 8 }}>
          Choose Avatar
        </Button>
        <Text variant="titleLarge">{displayName}</Text>
        <Chip style={{ marginTop: 6 }} mode="outlined">
          {user?.Role || 'User'}
        </Chip>
       
      </View>

      <View style={styles.form}>
        <TextInput
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          mode="outlined"
          style={styles.input}
          autoCapitalize="words"
        />
       
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          style={[styles.input, { backgroundColor: '#eee', color: '#888' }]}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={false}
          theme={{ colors: { text: '#888', placeholder: '#aaa' } }}
        />

        {!showPasswordFields && (
          <Button
            mode="outlined"
            onPress={() => setShowPasswordFields(true)}
            style={styles.button}
          >
            Change Password
          </Button>
        )}

        {showPasswordFields && (
          <>
            <TextInput
              label="Old Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Enter old password"
            />
            <TextInput
              label="New Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Enter new password"
            />
          </>
        )}
      </View>

      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          style={styles.button}
        >
          Save
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          disabled={isSaving}
          style={styles.button}
        >
          Cancel
        </Button>
      </View>
    <Snackbar
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={2000}
      style={{ position: 'absolute', top: 32, left: 16, right: 16, backgroundColor: snackbarMsg === 'Profile updated!' ? '#4CAF50' : '#E53935', zIndex: 100 }}
    >
      {snackbarMsg}
    </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6e8' },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 18,
  },
  form: {
    marginHorizontal: 18,
    marginBottom: 24,
  },
  input: {
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 8,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 4,
  },
});
