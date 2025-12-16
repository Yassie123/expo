import fetcher from "@/data/_fetcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {Image, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PROGRAMS = [
  { id: 1, name: "Velgen", icon: require("../assets/images/velgen.png"), iconWhite: require("../assets/images/velgenwit.png") },
  { id: 2, name: "Schuimlans", icon: require("../assets/images/schuimlans.png"), iconWhite: require("../assets/images/schuimlanswit.png") },
  { id: 3, name: "HP wassen", icon: require("../assets/images/hpwassen.png"), iconWhite: require("../assets/images/hpwassenwit.png") },
  { id: 4, name: "Wax", icon: require("../assets/images/wax.png"), iconWhite: require("../assets/images/waxwit.png") },
  { id: 5, name: "Schuimborstel", icon: require("../assets/images/schuimborstel.png"), iconWhite: require("../assets/images/schuimborstelwit.png") },
  { id: 6, name: "HP spoelen", icon: require("../assets/images/hpwassen.png"), iconWhite: require("../assets/images/hpwassenwit.png") },
  { id: 7, name: "Polish", icon: require("../assets/images/polish.png"), iconWhite: require("../assets/images/polishwit.png") },
  { id: 8, name: "Vlekvrij spoelen", icon: require("../assets/images/hpwassen.png"), iconWhite: require("../assets/images/hpwassenwit.png") },
  { id: 9, name: "Drogen", icon: require("../assets/images/drogen.png"), iconWhite: require("../assets/images/drogenwit.png") },
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
      Alert.alert("Geen tijdsduur", "Start de timer voordat je de wasbeurt afrondt.");
      return;
    }

    setLoading(true);
    try {
      const wash = {
        duration,
        cost: coins * 1, // assuming €1 per coin
        programs: selectedPrograms,
      };

      await fetcher(`/cars/${carId}/washes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wash),
      });

      Alert.alert("Gelukt", "Wasbeurt voltooid en opgeslagen!");
      router.back();
    } catch (err) {
      console.error("Error adding wash:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Back button and title - FIXED */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitleInline}>Nieuwe wasbeurt</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Timer Display */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Tijdsduur</Text>
          <Text style={styles.timerDisplay}>{formatTime(duration)}</Text>
          <TouchableOpacity
            style={[styles.timerButton, isRunning && styles.timerButtonPause]}
            onPress={() => setIsRunning(!isRunning)}
          >
            <Text style={styles.timerButtonText}>{isRunning ? "⏸ Pauze" : "▶ Start"}</Text>
          </TouchableOpacity>
        </View>

        {/* Coins Counter */}
        <View style={styles.coinsCard}>
          <Text style={styles.coinsLabel}>Muntinworp</Text>
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
        <Text style={styles.sectionTitle}>Gebruikte programma's</Text>
        <View style={styles.programsGrid}>
          {PROGRAMS.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.programContainer}
              onPress={() => toggleProgram(program.name)}
            >
              <View style={[
                styles.programCircle,
                selectedPrograms.includes(program.name) && styles.programCircleActive,
              ]}>
                <Image 
                  source={selectedPrograms.includes(program.name) ? program.iconWhite : program.icon} 
                  style={styles.programIcon} 
                  resizeMode="contain" 
                />
              </View>
              <Text style={styles.programText}>{program.name}</Text>
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
            {loading ? "Opslaan..." : "✓ Klaar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFDFF" },
  backText: { fontSize: 16, color: "#5C5C5C" },

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

  // Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FAFDFF',
    position: 'relative',
  },
  backButtonInline: {
    position: 'absolute',
    left: 20,
  },
  sectionTitleInline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C5C5C',
    textAlign: 'center',
  },

  // Timer
  timerCard: {
    backgroundColor: "#E3F5FF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 20,
  },
  timerLabel: { 
     fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 8, 
    textAlign: "center",
    color: "#0054BB",
    fontFamily: 'Urbanist_600SemiBold'
  },
  timerDisplay: { 
    fontSize: 48, 
    fontWeight: "bold", 
    color: "#0054BB", 
    marginBottom: 16,
    fontFamily: 'Urbanist_700Bold'
  },
  timerButton: {
    backgroundColor: "#0054BB",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  timerButtonPause: { backgroundColor: "#0054BB" },
  timerButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600",
    fontFamily: 'Urbanist_600SemiBold'
  },

  // Coins
  coinsCard: {
    backgroundColor: "#E3F5FF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  coinsLabel: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 12, 
    textAlign: "center",
    color: "#0054BB",
    fontFamily: 'Urbanist_600SemiBold'
  },
  coinsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  coinButton: {
    backgroundColor: "#0054BB",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  coinButtonText: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  coinsDisplay: { marginHorizontal: 24, alignItems: "center" },
  coinsNumber: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#0054BB",
    fontFamily: 'Urbanist_700Bold'
  },
  coinsCost: { 
    fontSize: 14, 
    color: "#0054BB", 
    marginTop: 4,
    fontFamily: 'Urbanist_400Regular'
  },

  // Programs
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: 'center',
    color: '#0054BB',
    marginHorizontal: 20,
  },
  programsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  programContainer: {
    width: 70,
    alignItems: "center",
    margin: 6,
  },
  programCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E3F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  programCircleActive: {
    backgroundColor: "#0054BB",
  },
  programIcon: { 
    width: 32, 
    height: 32,
  },
  programText: { 
    fontSize: 9, 
    color: "#0054BB", 
    textAlign: "center",
    marginTop: 4,
  },

  // Complete
  completeButton: {
    backgroundColor: "#0054BB",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    marginHorizontal: 20,
  },
  completeButtonDisabled: { backgroundColor: "#ccc" },
  completeButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
    fontFamily: 'Urbanist_700Bold'
  },
});