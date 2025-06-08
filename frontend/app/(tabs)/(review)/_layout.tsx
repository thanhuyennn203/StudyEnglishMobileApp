import { Stack } from "expo-router";

export default function ExploreRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="FlashCardScreen" options={{ headerShown: false }} />
      <Stack.Screen name="TakenTopicScreen" options={{ headerShown: false }} />
      <Stack.Screen name="GameScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
