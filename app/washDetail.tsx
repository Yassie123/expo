import fetcher from "@/data/_fetcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WashDetailScreen() {
  const router = useRouter();
  const { washId } = useLocalSearchParams();
  const [wash, setWash] = useState(null);
  const [loading, setLoading] = useState(true);

  const PROGRAM_ICONS = {
    "Pre-Wash": "💧",
    Soap: "🧼",
    Brush: "🧹",
    "High Pressure": "💨",
    Wax: "✨",
    Rinse: "🚿",
    Foam: "🫧",
    "Tire Cleaner": "⚫",
    "Spot Free": "💎",
    "Air Dry": "🌬️",
    Vacuum: "🔌",
  };

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
    <View style={{ flex: 1, backgroundColor: '#FAFDFF' }}>
      {/* HERO HEADER */}
      <View style={styles.heroContainer}>
        <Image source={require('../assets/images/shapedark.png')} style={styles.shapedark} resizeMode="contain" />
        <Image source={require('../assets/images/links.png')} style={styles.shapeLeft} resizeMode="contain" />
        <Image source={require('../assets/images/rechts.png')} style={styles.shapeRight} resizeMode="contain" />
        <Image source={require('../assets/images/orkaatje.png')} style={styles.orkaImg} resizeMode="contain" />
        <Image source={require('../assets/images/bubbels.png')} style={styles.secondImg} resizeMode="contain" />
        <Image source={require('../assets/images/bubbels2.png')} style={styles.thirdImg} resizeMode="contain" />
      </View>

      <ScrollView style={styles.container}>
        {/* Back button and Wash Details title */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitleInline}>Wash Details</Text>
        </View>

        {/* Wash Details */}
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

        {/* Programs Used */}
        {wash.programs && wash.programs.length > 0 && (
          <View style={styles.programsCard}>
            <Text style={styles.sectionTitle}>Programs Used</Text>
            <View style={styles.programsGrid}>
              {wash.programs.map((program, index) => (
                <View key={index} style={styles.programCircle}>
                  <Text style={styles.programIcon}>{PROGRAM_ICONS[program] || "❔"}</Text>
                  <Text style={styles.programText}>{program}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Car Info */}
        {wash.car && (
          <View style={styles.carInfo}>
            <Text style={styles.carLabel}>Car</Text>
            <Text style={styles.carText}>
              {wash.car.brand} {wash.car.model} ({wash.car.licensePlate})
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FAFDFF" },
  backText: { fontSize: 16, color: "#007bff" },
  detailCard: {
    backgroundColor: "#E3F5FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { fontSize: 16, fontWeight: "600", color: "#0054BB" },
  value: { fontSize: 16, color: "#000", flex: 1, textAlign: "right", fontFamily: 'Urbanist_400Regular' },
  sectionTitle: { fontSize: 20, fontWeight: "bold", textTransform: 'lowercase', textAlign: 'center', color: '#E3F5FF', marginBottom: 20 },
  programsCard: { backgroundColor: "#0054BB", borderRadius: 8, padding: 16, marginBottom: 20 },
  programsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
  programCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E3F5FF",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
    color: "#0054BB",
  },
  programIcon: { fontSize: 28, marginBottom: 2 },
  programText: { fontSize: 10, color: "#0054BB", textAlign: "center" },
  carInfo: { backgroundColor: "#fff3cd", borderRadius: 8, padding: 16 },
  carLabel: { fontSize: 14, color: "#666", marginBottom: 4 },
  carText: { fontSize: 16, fontWeight: "600" },

  // Hero styles
  heroContainer: {
    width: '100%',
    height: 200, 
    borderBottomRightRadius: 120, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative',
    marginBottom: 80,
  },
  shapedark: { width: '100%', position: 'absolute', top: -40, zIndex: 1 },
  shapeLeft: { width: '60%', position: 'absolute', right: -20, top: -120, transform: [{ rotate: '-189deg' }], zIndex: 5 },
  shapeRight: { width: '100%', position: 'absolute', top: -40, transform: [{ rotate: '-17deg' }], zIndex: 4 },
  orkaImg: { width: 150, height: 150, bottom: -50, left: -90, zIndex: 3 },
  secondImg: { width: '80%', position: 'absolute', top: -20, left: 10, zIndex: 2 },
  thirdImg: { width: '0%', position: 'absolute', bottom: -25, right: -80, zIndex: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  backButtonInline: {
    position: 'absolute',
    left: 0,
  },
  sectionTitleInline: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'lowercase',
    color: '#5C5C5C',
    textAlign: 'center',
  },
});
