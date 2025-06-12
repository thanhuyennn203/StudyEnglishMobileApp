import { Stack } from 'expo-router';

export default function ReviewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Stack sẽ tự inject route tương ứng vào đây */}
    </Stack>
  );
}
