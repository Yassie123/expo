import fetcher from "@/data/_fetcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PROGRAMS = [
  { id: 1, name: "Pre-Wash", icon: "💧" },
  { id: 2, name: "Soap", icon: "🧼" },
  { id: 3, name: "Brush", icon: "🧹" },
  { id: 4, name: "High Pressure", icon: "💨" },
  { id: 5, name: "Wax", icon: "✨" },
  { id: 6, name: "Rinse", icon: "🚿" },
  { id: 7, name: "Foam", icon: "🫧" },
  { id: 8, name: "Tire Cleaner", icon: "⚫" },
  { id: 9, name: "Spot Free", icon: "💎" },
  { id: 10, name: "Air Dry", icon: "🌬️" },
  { id: 11, name: "Vacuum", icon: "🔌" },
];

export default function AddWashScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams();
  
  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);
  
  // Wash data
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleProgram = (program) => {
    setSelectedPrograms((prev) => {
      if (prev.includes(program)) {
        return prev.filter((p) => p !== program);
      } else {
        return [...prev, program];
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddWash = async () => {
    if (duration === 0) {
      Alert.alert("No Duration", "Please start the timer before completing the wash");
      return;
    }

    setLoading(true);
    try {
      const wash = {
        duration,
        cost: coins * 1, // assuming €0.50 per coin
        programs: selectedPrograms,
      };

      await fetcher(`/cars/${carId}/washes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wash),
      });

      Alert.alert("Success", "Wash completed and saved!");
      router.back();
    } catch (err) {
      console.error("Error adding wash:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Car Wash Session</Text>

      {/* Timer Display */}
      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Duration</Text>
        <Text style={styles.timerDisplay}>{formatTime(duration)}</Text>
        <TouchableOpacity
          style={[styles.timerButton, isRunning && styles.timerButtonPause]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.timerButtonText}>{isRunning ? "⏸ Pause" : "▶ Start"}</Text>
        </TouchableOpacity>
      </View>

      {/* Coins Counter */}
      <View style={styles.coinsCard}>
        <Text style={styles.coinsLabel}>Coins Inserted</Text>
        <View style={styles.coinsRow}>
          <TouchableOpacity
            style={styles.coinButton}
            onPress={() => setCoins(Math.max(0, coins - 1))}
          >
            <Text style={styles.coinButtonText}>−</Text>
          </TouchableOpacity>
          <View style={styles.coinsDisplay}>
            <Text style={styles.coinsNumber}>{coins}</Text>
            <Text style={styles.coinsCost}>€{(coins * 1).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.coinButton} onPress={() => setCoins(coins + 1)}>
            <Text style={styles.coinButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Programs */}
      <Text style={styles.sectionTitle}>Programs Used</Text>
      <View style={styles.programsGrid}>
        {PROGRAMS.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={[
              styles.programButton,
              selectedPrograms.includes(program.name) && styles.programButtonActive,
            ]}
            onPress={() => toggleProgram(program.name)}
          >
            <Text style={styles.programIcon}>{program.icon}</Text>
            <Text
              style={[
                styles.programText,
                selectedPrograms.includes(program.name) && styles.programTextActive,
              ]}
            >
              {program.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Complete Button */}
      <TouchableOpacity
        style={[styles.completeButton, loading && styles.completeButtonDisabled]}
        onPress={handleAddWash}
        disabled={loading}
      >
        <Text style={styles.completeButtonText}>
          {loading ? "Saving..." : "✓ Complete Wash"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: "#007bff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },

  // Timer
  timerCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  timerLabel: { fontSize: 14, color: "#666", marginBottom: 8 },
  timerDisplay: { fontSize: 48, fontWeight: "bold", color: "#000", marginBottom: 16 },
  timerButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  timerButtonPause: { backgroundColor: "#ffc107" },
  timerButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  // Coins
  coinsCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  coinsLabel: { fontSize: 16, fontWeight: "600", marginBottom: 12, textAlign: "center" },
  coinsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  coinButton: {
    backgroundColor: "#ffc107",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  coinButtonText: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  coinsDisplay: { marginHorizontal: 24, alignItems: "center" },
  coinsNumber: { fontSize: 32, fontWeight: "bold", color: "#000" },
  coinsCost: { fontSize: 14, color: "#666", marginTop: 4 },

  // Programs
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  programsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  programButton: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  programButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  programIcon: { fontSize: 28, marginBottom: 4 },
  programText: { fontSize: 11, fontWeight: "600", color: "#333", textAlign: "center" },
  programTextActive: { color: "#fff" },

  // Complete
  completeButton: {
    backgroundColor: "#28a745",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  completeButtonDisabled: { backgroundColor: "#ccc" },
  completeButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});