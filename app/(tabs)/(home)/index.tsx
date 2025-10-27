import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useMessages from '@/data/messages';
import { ThemedText } from '@/components/themed-text';
import {Link} from 'expo-router';

export default function HomeScreen() {
  const { data, isLoading } = useMessages(); // <-- use your hook here
  console.log(data);
  if (isLoading){
    return(
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText type="title">Loading...</ThemedText>
        </View>
        </SafeAreaView>
    );
  }
    
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <ThemedText type="title">Home Screen</ThemedText>
      <Link href="/details">View details</Link>
      {data && data.map((message: any) => (
  <ThemedText key={message._id}>{message.text}</ThemedText>
))}
      </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:{
    backgroundColor: '#ccc',
    flex:1,
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    
  }

  
});
