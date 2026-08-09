import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import AddWordScreen from "../screens/AddWordScreen";
import WordListScreen from "../screens/WordListScreen";
import ReviewScreen from "../screens/ReviewScreen";
import AuthScreen from "../screens/AuthScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { logout, restoreSession } from "../services/authService";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    restoreSession().then(setAuthenticated).finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" /></View>;
  }

  if (!authenticated) {
    return <AuthScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>

        <Stack.Screen
          name="Add Word"
          component={AddWordScreen}
        />

        <Stack.Screen
          name="Word List"
          component={WordListScreen}
        />

        <Stack.Screen
          name="Review"
          component={ReviewScreen}
        />

        <Stack.Screen name="Profile">
          {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
