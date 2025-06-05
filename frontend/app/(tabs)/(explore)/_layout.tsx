import { Stack } from "expo-router";

export default function ExploreRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="flashCardScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
