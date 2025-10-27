import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function TabLayout() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('userId'); // make sure this key matches where you saved the user
        console.log("Raw AsyncStorage value:", user);

        if (user) {
          const parsedUser = JSON.parse(user);
          if (parsedUser?.id) {
            setUserId(parsedUser.id);
          } else {
            router.replace('/login');
          }
        } else {
          router.replace('/login');
        }
      } catch (err) {
        console.log("Error reading user from AsyncStorage:", err);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Loading user info...</Text>
      </View>
    );
  }

  if (!userId) {
    // User not logged in, router.replace will redirect
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        initialParams={{ userId }}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        initialParams={{ userId }}
        options={{ headerShown: false }}
      />
    </Tabs>
  );
}
