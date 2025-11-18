import fetcher from "@/data/_fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.container}>
       {/* TOP BLUE SHAPE + ORKA IMAGE */}
            <View style={styles.heroContainer}>
      
       
        {/* Second Shape */}
        <Image
          source={require('../assets/images/links.png')}
          style={styles.shapeLeft}
          resizeMode="contain"
        />
      
        {/* Third Shape */}
       <Image
          source={require('../assets/images/rechts.png')}
          style={styles.shapeRight}
          resizeMode="contain"
        />
        {/* First Image */}
        <Image
          source={require('../assets/images/orkaatje.png')}
          style={styles.orkaImg}
          resizeMode="contain"
        />
      
        {/* Second Image */}
        <Image
          source={require('../assets/images/bubbels.png')}
          style={styles.secondImg}
          resizeMode="contain"
        />
      
        {/* Third Image */}
        <Image
          source={require('../assets/images/bubbels2.png')}
          style={styles.thirdImg}
          resizeMode="contain"
        />
      
      </View>
      
        <Text style={styles.title}>Your Cars</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      {loading ? <Text>Loading...</Text> : null}

      {cars.length === 0 && !loading ? (
        <Text style={styles.emptyText}>No cars yet. Add your first car!</Text>
      ) : null}

      <FlatList
        data={cars}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.carItem}
            onPress={() => router.push(`/carDetail?carId=${item._id}` as any)}
            onLongPress={() => handleDeleteCar(item)}
          >
            <View>
              <Text style={styles.carText}>
                {item.brand} {item.model}
              </Text>
              <Text style={styles.licensePlate}>{item.licensePlate}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push("/addCar" as any)}
      >
        <Text style={styles.addButtonText}>+ Add Car</Text>
      </TouchableOpacity>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#ff3b30",
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: { textAlign: "center", color: "#666", marginTop: 20 },
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

});