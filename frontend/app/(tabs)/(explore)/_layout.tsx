import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="TopicListScreen" />
      <Stack.Screen name="WordCard" />
      <Stack.Screen name="WordListScreen" />
    </Stack>
  );
}
