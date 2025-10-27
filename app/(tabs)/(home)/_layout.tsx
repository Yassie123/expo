import {Stack} from "expo-router/stack";

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#f4511e'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            }}
        >
            <Stack.Screen name="index" options= {{title: 'Home'}}/>
            <Stack.Screen name="details" options= {{title: 'details'}}/>
        </Stack>
    );
}
