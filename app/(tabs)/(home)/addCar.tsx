import fetcher from "@/data/_fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddCarScreen() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCar = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem("userId");
      if (!stored) throw new Error("User not found");

      const { id: userId } = JSON.parse(stored);

      const car = { 
        brand, 
        model, 
        color, 
        licensePlate,
        user: userId  // ← This must be here!
      };

      console.log("🚗 Sending car data:", car); // Check this log

      await fetcher(`/users/${userId}/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car),
      });

      Alert.alert("Success", "Car added!");
      router.back();
    } catch (err) {
      console.error("Error adding car:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Car</Text>

      <TextInput placeholder="Brand" value={brand} onChangeText={setBrand} style={styles.input} />
      <TextInput placeholder="Model" value={model} onChangeText={setModel} style={styles.input} />
      <TextInput placeholder="Color" value={color} onChangeText={setColor} style={styles.input} />
      <TextInput placeholder="License Plate" value={licensePlate} onChangeText={setLicensePlate} style={styles.input} />

      <Button title={loading ? "Adding..." : "Add Car"} onPress={handleAddCar} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
});
