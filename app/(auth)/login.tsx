import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useLogin from '../../data/user.login';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { trigger: login, isLoading } = useLogin();
  const router = useRouter();

  const handleLogin = async () => {
  try {
    const res = await login({ email, password });

    if (res?.user?._id) {
      // Save user in AsyncStorage
      await AsyncStorage.setItem('userId', JSON.stringify({ id: res.user._id }));
      router.replace('/tabs/overviewScreen' as any);
    } else {
      console.log('Login failed', res);
    }
  } catch (err) {
    console.error('Login error:', err);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isLoading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={isLoading} />
      <Text style={styles.switchText} onPress={() => router.push('/register')}> Dont have an account? Register
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: '100%', padding: 12, marginVertical: 8, borderWidth: 1, borderRadius: 8 },
  switchText: { marginTop: 16, color: 'blue' },
});
