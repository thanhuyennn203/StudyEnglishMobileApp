import { Stack } from "expo-router";

export default function Layout() {
  return (
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="index" />
    //   <Stack.Screen name="onboarding" />
    //   {/* <Stack.Screen name="home" /> */}
    // </Stack>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="index" /> */}
    </Stack>
  );
}
