import fetcher from "@/data/_fetcher";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageSourcePropType } from "react-native";

// Define types
interface Car {
  _id: string;
  brand: string;
  model: string;
  licensePlate: string;
}

interface Wash {
  _id: string;
  date: string;
  duration?: number;
  cost?: number;
  programs?: string[];
  car?: Car;
}

type ProgramIconMap = Record<string, ImageSourcePropType>;
type ProgramTranslationMap = Record<string, string>;

export default function WashDetailScreen() {
  const router = useRouter();
  const { washId } = useLocalSearchParams<{ washId: string }>();
  const [wash, setWash] = useState<Wash | null>(null);
  const [loading, setLoading] = useState(true);

  const PROGRAM_ICONS: ProgramIconMap = {
    // Dutch names (keeping for compatibility)
    Velgen: require("../assets/images/velgen.png"),
    Schuimlans: require("../assets/images/schuimlans.png"),
    "HP wassen": require("../assets/images/hpwassen.png"),
    Wax: require("../assets/images/wax.png"),
    Schuimborstel: require("../assets/images/schuimborstel.png"),
    "HP spoelen": require("../assets/images/hpwassen.png"),
    Polish: require("../assets/images/polish.png"),
    "Vlekvrij spoelen": require("../assets/images/hpwassen.png"),
    Drogen: require("../assets/images/drogen.png"),
    
    // English names from API
    "Pre-Wash": require("../assets/images/hpwassen.png"),
    "Soap": require("../assets/images/schuimlans.png"),
    "Brush": require("../assets/images/schuimborstel.png"),
    "High Pressure": require("../assets/images/hpwassen.png"),
    "Rinse": require("../assets/images/hpwassen.png"),
    "Foam": require("../assets/images/schuimlans.png"),
    "Tire Cleaner": require("../assets/images/velgen.png"),
    "Spot Free": require("../assets/images/hpwassen.png"),
    "Air Dry": require("../assets/images/drogen.png"),
  };

  const PROGRAM_TRANSLATIONS: ProgramTranslationMap = {
    "Pre-Wash": "HP wassen",
    "Soap": "Schuimlans",
    "Brush": "Schuimborstel",
    "High Pressure": "HP spoelen",
    "Wax": "Wax",
    "Rinse": "HP spoelen",
    "Foam": "Schuimlans",
    "Tire Cleaner": "Velgen",
    "Spot Free": "Vlekvrij spoelen",
    "Air Dry": "Drogen",
  };

  useEffect(() => {
    fetchWash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getProgramIcon = (programName: string): ImageSourcePropType => {
    // Return the icon if it exists, otherwise return a default
    return PROGRAM_ICONS[programName] || PROGRAM_ICONS["HP wassen"];
  };

  const translateProgram = (programName: string): string => {
    return PROGRAM_TRANSLATIONS[programName] || programName;
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

      {/* Back button and Wash Details title - FIXED */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitleInline}>Was Details</Text>
      </View>

      <ScrollView style={styles.container}>

        {/* Wash Details */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Datum:</Text>
            <Text style={styles.value}>
              {new Date(wash.date).toLocaleDateString()} om{" "}
              {new Date(wash.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
          {/* Car Info */}
          {wash.car && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Auto:</Text>
              <Text style={styles.value}>
                {wash.car.brand} {wash.car.model} ({wash.car.licensePlate})
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tijdsduur:</Text>
            <Text style={styles.value}>{formatDuration(wash.duration || 0)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Muntinworp:</Text>
            <Text style={styles.value}>€{(wash.cost || 0).toFixed(2)}</Text>
          </View>
        </View>

        {/* Programs Used */}
        {wash.programs && wash.programs.length > 0 && (
          <View style={styles.programsCard}>
            <Text style={styles.sectionTitle}>Gebruikte programma's</Text>
            <View style={styles.programsGrid}>
              {wash.programs.map((program, index) => (
                <View key={index} style={styles.programCircle}>
                  <View style={styles.programIcon}>
                    <Image 
                      source={getProgramIcon(program)} 
                      style={{ width: 32, height: 32 }} 
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.programText}>{translateProgram(program)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAFDFF" 
  },
  backText: { 
    fontSize: 16, 
    color: "#5C5C5C" 
  },
  detailCard: {
    backgroundColor: "#E3F5FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#0054BB" 
  },
  value: { 
    fontSize: 16, 
    color: "#000", 
    flex: 1, 
    textAlign: "right", 
    fontFamily: 'Urbanist_400Regular' 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: 'center', 
    color: '#0054BB', 
    marginBottom: 20 
  },
  programsCard: {  
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 20, 
    marginHorizontal: 20 
  },
  programsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    gap: 12 
  },
  programCircle: {
    width: 70,
    alignItems: "center",
    margin: 6,
  },
  programIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E3F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  programText: { 
    fontSize: 9, 
    color: "#0054BB", 
    textAlign: "center", 
    marginTop: 4 
  },
  carLabel: { 
    fontSize: 14, 
    color: "#666", 
    marginBottom: 4 
  },
  carText: { 
    fontSize: 16, 
    fontWeight: "600" 
  },

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
  shapedark: { 
    width: '100%', 
    position: 'absolute', 
    top: -40, 
    zIndex: 1 
  },
  shapeLeft: { 
    width: '60%', 
    position: 'absolute', 
    right: -20, 
    top: -120, 
    transform: [{ rotate: '-189deg' }], 
    zIndex: 5 
  },
  shapeRight: { 
    width: '100%', 
    position: 'absolute', 
    top: -40, 
    transform: [{ rotate: '-17deg' }], 
    zIndex: 4 
  },
  orkaImg: { 
    width: 150, 
    height: 150, 
    bottom: -50, 
    left: -90, 
    zIndex: 3 
  },
  secondImg: { 
    width: '80%', 
    position: 'absolute', 
    top: -20, 
    left: 10, 
    zIndex: 2 
  },
  thirdImg: { 
    width: '0%', 
    position: 'absolute', 
    bottom: -25, 
    right: -80, 
    zIndex: 2 
  },
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
    left: 30,
  },
  sectionTitleInline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C5C5C',
    textAlign: 'center',
    width: '80%',
  },
});