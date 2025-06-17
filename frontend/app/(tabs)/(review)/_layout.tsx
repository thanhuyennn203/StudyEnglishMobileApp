import { Stack } from "expo-router";

export default function ReviewRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="FlashCardScreen" options={{ headerShown: false }} />
      <Stack.Screen name="TakenTopicScreen" options={{ headerShown: false }} />
      <Stack.Screen name="GameScreen" options={{ headerShown: false }} />
      <Stack.Screen name="VocabFlashGame" options={{ headerShown: false }} />
    </Stack>
  );
}
