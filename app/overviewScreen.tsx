import fetcher from "@/data/_fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Define types
interface Car {
  _id: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
}

type CarColorKey = 'white' | 'black' | 'gray' | 'blue' | 'red' | 'green' | 'yellow' | 'orange' | 'brown';

const CAR_COLORS: Record<CarColorKey, ImageSourcePropType> = {
  white: require('../assets/images/wit.png'),
  black: require('../assets/images/zwart.png'),
  gray: require('../assets/images/grijs.png'),
  blue: require('../assets/images/blauw.png'),
  red: require('../assets/images/rood.png'),
  green: require('../assets/images/green.png'),
  yellow: require('../assets/images/geel.png'),
  orange: require('../assets/images/oranje.png'),
  brown: require('../assets/images/bruin.png'),
};

export default function OverviewScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadUser = async () => {
        const stored = await AsyncStorage.getItem("userId");
        if (stored) {
          const { id } = JSON.parse(stored);
          setUserId(id);
          fetchCars(id);
        }
      };
      loadUser();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const fetchCars = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetcher(`/users/${id}/cars`);
      setCars(data.cars || []);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = (car: Car) => {
    Alert.alert(
      "Verwijder auto",
      `Ben je zeker dat je ${car.brand} ${car.model} wil verwijderen?`,
      [
        {
          text: "Annuleren",
          style: "cancel"
        },
        {
          text: "Verwijderen",
          style: "destructive",
          onPress: async () => {
            try {
              await fetcher(`/cars/${car._id}`, {
                method: "DELETE",
              });
              // Refresh the car list
              if (userId) {
                fetchCars(userId);
              }
              Alert.alert("Gelukt", "Auto succesvol verwijderd");
            } catch (err) {
              console.error("Error bij verwijderen van auto:", err);
              Alert.alert("Error", "Gefaald om auto te verwijderen");
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Log uit",
      "Ben je zeker dat je wil uitloggen?",
      [
        {
          text: "Annuleren",
          style: "cancel"
        },
        {
          text: "Log uit",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userId");
            router.replace("/login");
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFDFF' }}>
      
      {/* BLUE SHAPE OUTSIDE SAFEAREA */}
      <View style={styles.heroContainer}>
        <Image source={require('../assets/images/shapedark.png')} style={styles.shapedark} resizeMode="contain" />
        <Image source={require('../assets/images/links.png')} style={styles.shapeLeft} resizeMode="contain" />
        <Image source={require('../assets/images/rechts.png')} style={styles.shapeRight} resizeMode="contain" />
        <Image source={require('../assets/images/orkaatje.png')} style={styles.orkaImg} resizeMode="contain" />
        <Image source={require('../assets/images/bubbels.png')} style={styles.secondImg} resizeMode="contain" />
        <Image source={require('../assets/images/bubbels2.png')} style={styles.thirdImg} resizeMode="contain" />
      </View>

      {/* ALL CONTENT INSIDE SAFE AREA */}
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Hier vind je je auto's</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log uit</Text>
          </TouchableOpacity>
        </View>

        {loading ? <Text>Data laden...</Text> : null}

        {cars.length === 0 && !loading ? (
          <Text style={styles.emptyText}>Je hebt nog geen auto's aangemaakt, {"\n"} voeg je eerste toe!</Text>
        ) : null}

        <FlatList
          data={cars}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.circlesContainer}
          renderItem={({ item }) => {
            const carColorImage = CAR_COLORS[item.color as CarColorKey] || require('../assets/images/carfoambox.png');
            
            return (
              <TouchableOpacity
                style={styles.circleWrapper}
                onPress={() => router.push(`/carDetail?carId=${item._id}`)}
                onLongPress={() => handleDeleteCar(item)}
              >
                <View style={styles.circle}>
                  <Image
                    source={carColorImage}
                    style={styles.carIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.circleLabel}>{item.model}</Text>
                <Text style={styles.licensePlateSmall}>{item.licensePlate}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.addSection}>
          <Text style={styles.addTitle}>Nieuwe auto aanmaken</Text>
          <TouchableOpacity
            style={styles.addCircle}
            onPress={() => router.push("/addCar")}
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
    alignItems: 'center',
  },

  headerRow: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
    position: 'relative'
  },

  heading: { 
    fontSize: 20, 
    fontWeight: "bold", 
    fontFamily: 'Urbanist_700Bold',
    textAlign: 'center',
    color: '#5C5C5C',
    zIndex: -1,
  },
  logoutButton: {
    zIndex: 99,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#0054BB",
  },
  logoutText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: { 
    textAlign: "center", 
    color: "#0054BB", 
    marginTop: 100 
  },

  circlesContainer: {
    paddingHorizontal: 20,
  },
  circleWrapper: {
    width: 110,
    alignItems: 'center',
    marginRight: 12,
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 300,
    backgroundColor: '#B8E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 75,
  },
  carIcon: {
    width: 100,
    height: 100,
  },
  circleLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  licensePlateSmall: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  addSection: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addTitle: {
    fontSize: 20, 
    fontWeight: "bold", 
    fontFamily: 'Urbanist_700Bold',
    textAlign: 'center',
    color: '#5C5C5C',
    marginBottom: 30, 
  },
  addCircle: {
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

  carItem: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  carText: { 
    fontSize: 16, 
    fontWeight: "600" 
  },
  licensePlate: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 4 
  },
  arrow: { 
    fontSize: 20, 
    color: "#5C5C5C" 
  },
  addButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#0054BB",
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  
  heroContainer: {
    width: '100%',
    height: 200, 
    backgroundColor: '#81D3FF', 
    borderBottomRightRadius: 120, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative',
    marginBottom: 80,
    pointerEvents: 'none',
  },

  shapeLeft: {
    width: '60%',
    position: 'absolute',
    right: -20,
    top: -120,
    transform: [{ rotate: '-189deg' }],
    zIndex: 5,
  },

  shapeRight: {
    width: '100%',
    position: 'absolute',
    transform: [{ rotate: '-17deg' }],
    top: -40,
    zIndex: 4,
  },

  orkaImg: {
    width: 150,
    height: 150,
    bottom: -50,
    left: -90,
    zIndex: 3,
  },

  secondImg: {
    width: '80%',
    position: 'absolute',
    top: -20,
    left: 10,
    zIndex: 2,
  },

  thirdImg: {
    width: '0%',
    position: 'absolute',
    bottom: -25,
    right: -80,
    zIndex: 2,
  },
  
  shapedark: {
    width: '100%',
    position: 'absolute',
    top: -40,
    zIndex: 1,
  }
});