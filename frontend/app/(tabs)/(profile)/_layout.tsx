import { Stack } from "expo-router";

export default function ProfileRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
