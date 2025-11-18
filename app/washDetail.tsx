import fetcher from "@/data/_fetcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WashDetailScreen() {
  const router = useRouter();
  const { washId } = useLocalSearchParams();
  const [wash, setWash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWash();
  }, [washId]);

  const fetchWash = async () => {
    try {
      const data = await fetcher(`/cars/washes/${washId}`);
      setWash(data);
    } catch (err) {
      console.error("Error fetching wash:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading || !wash) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Wash Details</Text>

      <View style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(wash.date).toLocaleDateString()} at{" "}
            {new Date(wash.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{formatDuration(wash.duration || 0)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Cost:</Text>
          <Text style={styles.value}>€{(wash.cost || 0).toFixed(2)}</Text>
        </View>
      </View>

      {wash.programs && wash.programs.length > 0 ? (
        <View style={styles.programsCard}>
          <Text style={styles.sectionTitle}>Programs Used</Text>
          <View style={styles.programsList}>
            {wash.programs.map((program, index) => (
              <View key={index} style={styles.programChip}>
                <Text style={styles.programChipText}>{program}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {wash.car ? (
        <View style={styles.carInfo}>
          <Text style={styles.carLabel}>Car</Text>
          <Text style={styles.carText}>
            {wash.car.brand} {wash.car.model} ({wash.car.licensePlate})
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: "#007bff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  detailCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#666" },
  value: { fontSize: 16, color: "#000", flex: 1, textAlign: "right" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  programsCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  programsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  programChip: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  programChipText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  carInfo: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 16,
  },
  carLabel: { fontSize: 14, color: "#666", marginBottom: 4 },
  carText: { fontSize: 16, fontWeight: "600" },
});