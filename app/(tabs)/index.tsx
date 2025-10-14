import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import useNetwork from '../../data/network'; // <-- import your custom hook

export default function HomeScreen() {
  const { network, isLoading, isError } = useNetwork(); // <-- use your hook here

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          style={{ fontFamily: Platform.select({ ios: 'Oswald_400Regular' }) }}
          type="title"
        >
          hihihihi!
        </ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Step 1 */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>

      {/* Step 2 */}
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
        </Link>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>

      {/* Step 3 */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory.
        </ThemedText>
      </ThemedView>

      {/* Orka Network Data */}
      <ThemedView style={styles.stepContainer}>
  <ThemedText type="subtitle">Orka Messages</ThemedText>

  {isLoading && <ThemedText>Loading messages...</ThemedText>}
  {isError && <ThemedText type="link">Failed to load messages.</ThemedText>}

  {network?.map((msg: any) => (
    <ThemedView key={msg._id} style={styles.card}>
      <ThemedText type="defaultSemiBold">
        {msg.sender?.username ?? 'Unknown'}
      </ThemedText>
      <ThemedText type="default">{msg.text}</ThemedText>
      <ThemedText type="subtitle">{new Date(msg.createdAt).toLocaleString()}</ThemedText>
    </ThemedView>
  ))}
</ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
});
