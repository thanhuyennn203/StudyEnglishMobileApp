import { Stack } from "expo-router";

export const unstable_settings = {
  headerShown: false,
};

export default function AdminRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="topics" options={{ headerShown: false }} />
      <Stack.Screen name="words" options={{ headerShown: false }} />
    </Stack>
  );
}
