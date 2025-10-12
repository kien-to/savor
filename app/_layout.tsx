import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { StripeProvider } from "@stripe/stripe-react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "../context/AuthContext";
import { StoreOwnerProvider } from "../context/StoreOwnerContext";
import AppWrapper from "../components/AppWrapper";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StoreOwnerProvider>
        <StripeProvider
        publishableKey={
          "pk_live_51KtHVXIv6VEkZcYaIHlJAmVeKkAyjmqifbBYHKz3L0arzHYAwvqElkW8s2n0aQm3pMU8QsmyduG1y64Vh5eu4FgZ006d0HjXDf"
        }
        // process.env.PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.savor.app" // Optional for Apple Pay
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AppWrapper>
            <Stack>
                   <Stack.Screen name="index" options={{ headerShown: false }} />
                   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                   <Stack.Screen
                     name="LoginScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="PhoneLoginScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="EmailLoginScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="EmailScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="CountryScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="OnboardingScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen name="+not-found" />
                   <Stack.Screen
                     name="ForgotPasswordScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="SettingsScreen"
                     options={{
                       headerShown: false,
                       presentation: "modal",
                     }}
                   />
                   <Stack.Screen
                     name="AddBusinessDetailsScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="StoreScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="PaymentScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="ContactScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="SignUpStoreScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="AccountDetailsScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="StoreListScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
                   <Stack.Screen
                     name="StoreOwnerScreen"
                     options={{
                       headerShown: false,
                     }}
                   />
            </Stack>
            <StatusBar style="auto" />
          </AppWrapper>
        </ThemeProvider>
        </StripeProvider>
      </StoreOwnerProvider>
    </AuthProvider>
  );
}
