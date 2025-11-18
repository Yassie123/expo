import fetcher from "@/data/_fetcher";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CarDetailScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams();
  const [car, setCar] = useState(null);
  const [washes, setWashes] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCarDetails();
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

  const handleDeleteWash = (wash) => {
    Alert.alert(
      "Delete Wash",
      `Delete wash from ${new Date(wash.date).toLocaleDateString()}?`,
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
              await fetcher(`/cars/washes/${wash._id}`, {
                method: "DELETE",
              });
              fetchCarDetails(); // Refresh the list
              Alert.alert("Success", "Wash deleted successfully");
            } catch (err) {
              console.error("Error deleting wash:", err);
              Alert.alert("Error", "Failed to delete wash");
            }
          }
        }
      ]
    );
  };

  const formatDuration = (seconds) => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.carHeader}>
        <Text style={styles.title}>{car.brand} {car.model}</Text>
        <Text style={styles.licensePlate}>{car.licensePlate}</Text>
        {car.color ? <Text style={styles.color}>Color: {car.color}</Text> : null}
      </View>

      <Text style={styles.sectionTitle}>Wash History</Text>

      {washes.length === 0 ? (
        <Text style={styles.emptyText}>No washes recorded yet</Text>
      ) : (
        <FlatList
          data={washes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.washItem}
              onPress={() => router.push(`/washDetail?washId=${item._id}` as any)}
              onLongPress={() => handleDeleteWash(item)}
            >
              <View>
                <Text style={styles.washDate}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.washInfo}>
                  {formatDuration(item.duration)} • €{(item.cost || 0).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push(`/addWash?carId=${carId}` as any)}
      >
        <Text style={styles.addButtonText}>+ Add Wash</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: "#007bff" },
  carHeader: { 
    padding: 16, 
    backgroundColor: "#f5f5f5", 
    borderRadius: 8,
    marginBottom: 20 
  },
  title: { fontSize: 24, fontWeight: "bold" },
  licensePlate: { fontSize: 16, color: "#666", marginTop: 4 },
  color: { fontSize: 14, color: "#666", marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  emptyText: { textAlign: "center", color: "#666", marginTop: 20 },
  washItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  washDate: { fontSize: 16, fontWeight: "600" },
  washInfo: { fontSize: 14, color: "#666", marginTop: 4 },
  arrow: { fontSize: 20, color: "#007bff" },
  addButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});