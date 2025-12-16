import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

// Urbanist
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';

// Unbounded
import {
  Unbounded_400Regular,
  Unbounded_500Medium,
  Unbounded_700Bold,
} from '@expo-google-fonts/unbounded';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Unbounded_400Regular,
    Unbounded_500Medium,
    Unbounded_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="overviewScreen" />
      <Stack.Screen name="addCar" />
      <Stack.Screen name="carDetail" />
      <Stack.Screen name="addWash" />
      <Stack.Screen name="washDetail" />
    </Stack>
  );
}
