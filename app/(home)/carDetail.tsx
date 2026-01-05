import fetcher from "@/data/_fetcher";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, FlatList, StyleSheet, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Define types
interface Car {
  _id: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
}

interface Wash {
  _id: string;
  date: string;
  duration?: number;
}

type CarColorKey = 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'orange' | 'brown';

const CAR_COLORS: Record<CarColorKey, ImageSourcePropType> = {
  white: require('../../assets/images/wit.png'),
  black: require('../../assets/images/zwart.png'),
  gray: require('../../assets/images/grijs.png'),
  blue: require('../../assets/images/blauw.png'),
  red: require('../../assets/images/rood.png'),
  green: require('../../assets/images/green.png'),
  yellow: require('../../assets/images/geel.png'),
  orange: require('../../assets/images/oranje.png'),
  brown: require('../../assets/images/bruin.png'),
};

export default function CarDetailScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [washes, setWashes] = useState<Wash[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCarDetails();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carId])
  );

  const fetchCarDetails = async () => {
    setLoading(true);
    try {
      const carData = await fetcher(`/cars/${carId}`);
      setCar(carData);
      
      const washData = await fetcher(`/cars/${carId}/washes`);
      setWashes(washData.washes || []);
    } catch (err) {
      console.error("Error fetching car details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWash = (wash: Wash) => {
    Alert.alert(
      "Verwijder wasbeurt",
      `Verwijder wasbeurt van ${new Date(wash.date).toLocaleDateString()}?`,
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Verwijderen",
          style: "destructive",
          onPress: async () => {
            try {
              await fetcher(`/cars/washes/${wash._id}`, { method: "DELETE" });
              fetchCarDetails(); // Refresh the list
              Alert.alert("Gelukt", "Wasbeurt succesvol verwijderd!");
            } catch (err) {
              console.error("Error bij verwijderen wasbeurt:", err);
              Alert.alert("Error", "Gefaald om wasbeurt te verwijderen");
            }
          }
        }
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading || !car) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const carColorImage = CAR_COLORS[car.color as CarColorKey] || require('../../assets/images/carfoambox.png');

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFDFF' }}>
      
      {/* BLUE SHAPES/IMAGES */}
      <View style={styles.heroContainer}>
        <Image source={require('../../assets/images/shapedark.png')} style={styles.shapedark} resizeMode="contain" />
        <Image source={require('../../assets/images/links.png')} style={styles.shapeLeft} resizeMode="contain" />
        <Image source={require('../../assets/images/rechts.png')} style={styles.shapeRight} resizeMode="contain" />
        <Image source={require('../../assets/images/orkaatje.png')} style={styles.orkaImg} resizeMode="contain" />
        <Image source={require('../../assets/images/bubbels.png')} style={styles.secondImg} resizeMode="contain" />
        <Image source={require('../../assets/images/bubbels2.png')} style={styles.thirdImg} resizeMode="contain" />
      </View>

      {/* MAIN CONTENT */}
      <SafeAreaView style={styles.container}>
        {/* Wash History Header with Back Button */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitleInline}>Hier zie je de recentste wasbeurten</Text>
        </View>

        {/* Wash History */}
        {washes.length === 0 ? (
          <Text style={styles.emptyText}>Nog geen wasbeurten geregistreerd</Text>
        ) : (
          <FlatList
            data={washes}
            keyExtractor={(item) => item._id}
            style={{ maxHeight: 300 }}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            renderItem={({ item: wash }) => (
              <View style={{ position: 'relative', marginBottom: 12, overflow: 'visible' }}>
                <TouchableOpacity
                  style={styles.washCard}
                  onPress={() => router.push(`/washDetail?washId=${wash._id}`)}
                  onLongPress={() => handleDeleteWash(wash)}
                >
                  <Text style={styles.washDateCard}>
                    Datum: {new Date(wash.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>

                {/* Car image floating out of the card */}
                <Image
                  source={carColorImage}
                  style={styles.carIconBig}
                />
              </View>
            )}
          />
        )}

        {/* New Wash */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Nieuwe Wasbeurt</Text>
        <View style={styles.newWashContainer}>
          <TouchableOpacity
            style={styles.newWashCircle}
            onPress={() => router.push(`/addWash?carId=${carId}`)}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFDFF', 
    padding: 20 
  },
  backButton: { 
    marginBottom: 10 
  },
  backText: { 
    fontSize: 16, 
    color: "#5C5C5C" 
  },
  carHeader: { 
    padding: 16, 
    backgroundColor: "#f5f5f5", 
    borderRadius: 8, 
    marginBottom: 20 
  },
  title: {    
    fontSize: 20, 
    fontWeight: "bold", 
    fontFamily: 'Urbanist_700Bold',
    textAlign: 'center',
    color: '#5C5C5C',
    marginBottom: 30,  
  },
  licensePlate: { 
    fontSize: 16, 
    color: "#666", 
    marginTop: 4 
  },
  color: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 4 
  },
  sectionTitle: {    
    fontSize: 20, 
    fontWeight: "bold", 
    fontFamily: 'Urbanist_700Bold',
    textAlign: 'center',
    color: '#5C5C5C',
    marginBottom: 30,  
  },
  emptyText: { 
    textAlign: "center", 
    color: "#0054BB", 
    marginTop: 70, 
    marginBottom: 150 
  },
  washItem: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: "#e0e0e0", 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },  
  washInfo: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 4 
  },
  arrow: { 
    fontSize: 20, 
    color: "#0054BB" 
  },
  addButton: { 
    marginTop: 20, 
    padding: 16, 
    backgroundColor: "#0054BB", 
    borderRadius: 8, 
    alignItems: "center" 
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  washCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FF',
    padding: 12,
    borderRadius: 14,
    borderBottomRightRadius: 40,
    height: 60,
    overflow: 'hidden',
  },
  carIconBig: {
    width: 110,
    height: 110,
    position: 'absolute',
    top: -25,
    left: 0,
    zIndex: 10,
  },
  washDateCard: {
    flex: 1,
    fontSize: 16,
    color: '#0054BB',
    fontFamily: 'Urbanist_400Regular',
    marginLeft: 120,
  },
  newWashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  newWashCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0054BB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 36,
    fontWeight: '700',
  },
  heroContainer: {
    width: '100%',
    height: 200, 
    borderBottomRightRadius: 120, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative',
    marginBottom: 80,
  },
  shapedark: { 
    width: '100%', 
    position: 'absolute', 
    top: -40, 
    zIndex: 1 
  },
  shapeLeft: { 
    width: '60%', 
    position: 'absolute', 
    right: -20, 
    top: -120, 
    transform: [{ rotate: '-189deg' }], 
    zIndex: 5 
  },
  shapeRight: { 
    width: '100%', 
    position: 'absolute', 
    top: -40, 
    transform: [{ rotate: '-17deg' }], 
    zIndex: 4 
  },
  orkaImg: { 
    width: 150, 
    height: 150, 
    bottom: -50, 
    left: -90, 
    zIndex: 3 
  },
  secondImg: { 
    width: '80%', 
    position: 'absolute', 
    top: -20, 
    left: 10, 
    zIndex: 2 
  },
  thirdImg: { 
    width: '0%', 
    position: 'absolute', 
    bottom: -25, 
    right: -80, 
    zIndex: 2 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonInline: {
    marginRight: 10,
  },
  sectionTitleInline: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
    color: '#5C5C5C',
  },
});