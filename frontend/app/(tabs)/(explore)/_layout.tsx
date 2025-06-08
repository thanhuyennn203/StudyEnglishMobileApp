import { Stack } from "expo-router";

export default function ReviewRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
