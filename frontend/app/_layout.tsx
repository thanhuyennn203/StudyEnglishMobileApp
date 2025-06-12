import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "../hooks/useAuth";

import { useFonts, Baloo2_600SemiBold } from "@expo-google-fonts/baloo-2";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";

// Custom paper theme with Baloo2 font applied
const paperTheme = {
  ...PaperDefaultTheme,
  fonts: {
    ...PaperDefaultTheme.fonts,
    regular: { fontFamily: "Baloo2_600SemiBold", fontWeight: "normal" },
    medium: { fontFamily: "Baloo2_600SemiBold", fontWeight: "normal" },
    light: { fontFamily: "Baloo2_600SemiBold", fontWeight: "normal" },
    thin: { fontFamily: "Baloo2_600SemiBold", fontWeight: "normal" },
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Baloo2_600SemiBold,
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
