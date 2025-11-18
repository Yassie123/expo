import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import fetcher from '../../data/user.login'; // or wherever your fetcher is
import { View, Image, TouchableOpacity } from 'react-native';



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetcher('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res?.user?._id) {
        await AsyncStorage.setItem('userId', JSON.stringify({ id: res.user._id }));
        router.replace('/overviewScreen');
      } else {
        console.log('Login failed', res);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <SafeAreaView style={styles.container}>

      {/* TOP BLUE SHAPE + ORKA IMAGE */}
      <View style={styles.heroContainer}>

 
  {/* Second Shape */}
  <Image
    source={require('../../assets/images/links.png')}
    style={styles.shapeLeft}
    resizeMode="contain"
  />

  {/* Third Shape */}
 <Image
    source={require('../../assets/images/rechts.png')}
    style={styles.shapeRight}
    resizeMode="contain"
  />
  {/* First Image */}
  <Image
    source={require('../../assets/images/orkaatje.png')}
    style={styles.orkaImg}
    resizeMode="contain"
  />

  {/* Second Image */}
  <Image
    source={require('../../assets/images/bubbels.png')}
    style={styles.secondImg}
    resizeMode="contain"
  />

  {/* Third Image */}
  <Image
    source={require('../../assets/images/bubbels2.png')}
    style={styles.thirdImg}
    resizeMode="contain"
  />

</View>


      {/* TITLE */}
      <Text style={styles.title}>Welkom bij{'\n'}Orka Autowas</Text>

      {/* SUBTITLE */}
      <Text style={styles.subtitle}>
        Log in met je gebruikersnaam en{'\n'}wachtwoord
      </Text>

      {/* INPUTS */}
      <TextInput
        style={styles.input}
        placeholder="Gebruikersnaam"
        placeholderTextColor="#0054BB"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" 
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
         placeholderTextColor="#0054BB"
        secureTextEntry
        value={password}
        onChangeText={setPassword}

      />

      {/* LOGIN BUTTON */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.loginText}>{isLoading ? "Bezig..." : "Log in  →"}</Text>
      </TouchableOpacity>
<Text style={styles.switchText} onPress={() => router.push('/(auth)/register')}> Don't have an account? Register </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFF',
    alignItems: 'center',
    paddingTop: 20,
  },

 heroContainer: {
width: '100%',
  height: 300, 
  backgroundColor: '#81D3FF', 
  borderBottomRightRadius: 120, 
  justifyContent: 'center', 
  alignItems: 'center', 
  overflow: 'hidden',
  position: 'relative',
},



shapeLeft: {
  width: '80%',
  position: 'absolute',
  left: -30,
  bottom: -70,
  zIndex: 5,
},

shapeRight: {
  width: '80%',
  position: 'absolute',
  right: -50,
  top: -20,
  zIndex: 1,

},

orkaImg: {
  width: 220,
  height: 220,
  marginTop: 20,
  zIndex: 3,
},

secondImg: {
  width: '80%',
  position: 'absolute',
  top: -20,
  left: 10,
  zIndex: 0,
},

thirdImg: {
  width: '80%',
  position: 'absolute',
  bottom: -25,
  right: -80,
  zIndex: 0,
},


  title: {
    fontSize: 28,
    fontFamily: 'Unbounded_700Bold',
    fontWeight: '700',
    textAlign: 'center',
    
    color: '#0054BB',
    marginTop: 26,
  },

  subtitle: {
    textAlign: 'center',
    fontFamily: 'Urbanist_400Regular',
    color: '#5C5C5C',
    marginTop: 12,
    marginBottom: 25,
    fontSize: 20,
  },

  input: {
    width: '85%',
    backgroundColor: '#FAFDFF',
    fontFamily: 'Urbanist_400Regular',
    borderWidth: 2,
    borderColor: '#0054BB',
    color: '#0054BB',
    padding: 20,
    borderRadius: 40,
    marginVertical: 10,
    fontSize: 16,
  },
 

  loginBtn: {
    width: '85%',
    backgroundColor: '#0054BB',
    paddingVertical: 16,
    borderRadius: 40,
    borderTopRightRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },

  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 20,
    color: '#0054BB',
    fontSize: 14,
  },
});