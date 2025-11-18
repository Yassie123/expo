import { ThemedText } from '@/components/themed-text';
import useUserGet from '@/data/user-get';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useUserPut from '../data/user-put';

export default function SettingsScreen() {
    const params = useLocalSearchParams();
    const { data, isLoading } = useUserGet(params.userId); // <-- use your hook here
    const { trigger, isMutating } = useUserPut(params.userId); // <-- use your hook here
    const [username, setUsername] = useState('');

    console.log(data)

    useEffect(() => {
        if (data){
            setUsername(data.username);
        }   
    }, [data]);

if (isLoading || isMutating || !data) {
    return(
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText type="title">Loading...</ThemedText>
        </View>
        </SafeAreaView>
    );
  }

  console.log("Username:", username);
    return (
        <SafeAreaView style={styles.container} >
        <Text>Settings Screen</Text>
                <TextInput value={username} onChangeText={setUsername}/>
        <Button title="Update Username" onPress={() => trigger({username})}/>
        </SafeAreaView>
    );
    }
    const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
     safeArea:{
    backgroundColor: '#646464ff',
    flex:1,
  },
    });
    