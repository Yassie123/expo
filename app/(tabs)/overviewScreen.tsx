import fetcher from "@/data/_fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OverviewScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("userId");
      if (stored) {
        const { id } = JSON.parse(stored);
        setUserId(id);
        fetchCars(id);
      }
    };
    loadUser();
  }, []);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cars</Text>

      {loading ? <Text>Loading...</Text> : null}

      <FlatList
        data={cars}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.carItem}>
            <Text>{item.brand} {item.model} ({item.licensePlate})</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(tabs)/(home)/addCar" as any)}>
        <Text style={styles.addButtonText}>+ Add Car</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  carItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  addButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
