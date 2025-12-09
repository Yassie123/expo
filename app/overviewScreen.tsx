// ...existing code...
import fetcher from "@/data/_fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
// ...existing code...

export default function OverviewScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [cars, setCars] = useState([]);
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
    }, [])
  );

  const fetchCars = async (id) => {
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

  const handleDeleteCar = (car) => {
    Alert.alert(
      "Delete Car",
      `Are you sure you want to delete ${car.brand} ${car.model}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await fetcher(`/cars/${car._id}`, {
                method: "DELETE",
              });
              // Refresh the car list
              fetchCars(userId);
              Alert.alert("Success", "Car deleted successfully");
            } catch (err) {
              console.error("Error deleting car:", err);
              Alert.alert("Error", "Failed to delete car");
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
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
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? <Text>Loading...</Text> : null}

      {cars.length === 0 && !loading ? (
        <Text style={styles.emptyText}>No cars yet. Add your first car!</Text>
      ) : null}

      <FlatList
        data={cars}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.circlesContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.circleWrapper}
            onPress={() => router.push(`/carDetail?carId=${item._id}` as any)}
            onLongPress={() => handleDeleteCar(item)}
          >
            <View style={styles.circle}>
              <Image
                source={require('../assets/images/carfoambox.png')}
                style={styles.carIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.circleLabel}>{item.model}</Text>
            <Text style={styles.licensePlateSmall}>{item.licensePlate}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.addSection}>
        <Text style={styles.addTitle}>Nieuwe auto aanmaken</Text>
        <TouchableOpacity
          style={styles.addCircle}
          onPress={() => router.push("/addCar" as any)}
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
  zIndex: 10,        // <-- add this
  position: 'relative' // required for zIndex to work
},

  heading: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textTransform: 'lowercase',
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
  emptyText: { textAlign: "center", color: "#666" },

  circlesContainer: {

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
    textTransform: 'lowercase',
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
  carText: { fontSize: 16, fontWeight: "600" },
  licensePlate: { fontSize: 14, color: "#666", marginTop: 4 },
  arrow: { fontSize: 20, color: "#007bff" },
  addButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
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