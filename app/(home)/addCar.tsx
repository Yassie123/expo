import fetcher from "@/data/_fetcher";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  Alert, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback
} from "react-native";

// Color options with their corresponding car icon assets
const CAR_COLORS = [
  { name: "wit", value: "white", icon: require("../../assets/images/wit.png") },
  { name: "zwart", value: "black", icon: require("../../assets/images/zwart.png") },
  { name: "grijs", value: "gray", icon: require("../../assets/images/grijs.png") },
  { name: "blauw", value: "blue", icon: require("../../assets/images/blauw.png") },
  { name: "rood", value: "red", icon: require("../../assets/images/rood.png") },
  { name: "groen", value: "green", icon: require("../../assets/images/green.png") },
  { name: "geel", value: "yellow", icon: require("../../assets/images/geel.png") },
  { name: "oranje", value: "orange", icon: require("../../assets/images/oranje.png") },
  { name: "bruin", value: "brown", icon: require("../../assets/images/bruin.png") },
];

export default function AddCarScreen() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const selectedColorObj = CAR_COLORS.find(c => c.value === color);

  const handleAddCar = async () => {
    if (!brand || !model || !color || !licensePlate) {
      Alert.alert("Ontbrekende velden", "Vul al de velden in alstublieft");
      return;
    }

    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem("userId");
      if (!stored) throw new Error("Gebruiker niet gevonden");

      const { id: userId } = JSON.parse(stored);

      const car = { 
        brand, 
        model, 
        color, 
        licensePlate,
        user: userId
      };

      console.log("🚗 Sending car data:", car);

      await fetcher(`/users/${userId}/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car),
      });

      Alert.alert("Gelukt", "Auto toegevoegd!");
      router.back();
    } catch (err) {
      console.error("Error bij toevoegen van auto:", err);
      Alert.alert("Error", err.message || "Er ging iets miss");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: '#FAFDFF' }}>
          {/* HERO HEADER */}
          <View style={styles.heroContainer}>
            <Image source={require('../../assets/images/shapedark.png')} style={styles.shapedark} resizeMode="contain" />
            <Image source={require('../../assets/images/links.png')} style={styles.shapeLeft} resizeMode="contain" />
            <Image source={require('../../assets/images/rechts.png')} style={styles.shapeRight} resizeMode="contain" />
            <Image source={require('../../assets/images/orkaatje.png')} style={styles.orkaImg} resizeMode="contain" />
            <Image source={require('../../assets/images/bubbels.png')} style={styles.secondImg} resizeMode="contain" />
            <Image source={require('../../assets/images/bubbels2.png')} style={styles.thirdImg} resizeMode="contain" />
          </View>

          {/* Back button and title - FIXED */}
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonInline}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitleInline}>Nieuwe auto</Text>
          </View>

          <ScrollView 
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Car Preview */}
            {selectedColorObj && (
              <View style={styles.previewSection}>
                <Image source={selectedColorObj.icon} style={styles.carPreview} resizeMode="contain" />
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formCard}>
              <Text style={styles.label}>Merk</Text>
              <TextInput 
                placeholder="vb. Volkswagen" 
                value={brand} 
                onChangeText={setBrand} 
                style={styles.input}
                placeholderTextColor="#999"
                keyboardAppearance="light"
              />

              <Text style={styles.label}>Model</Text>
              <TextInput 
                placeholder="vb. Golf" 
                value={model} 
                onChangeText={setModel} 
                style={styles.input}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Nummerplaat</Text>
              <TextInput 
                placeholder="vb. 1-ABC-123" 
                value={licensePlate} 
                onChangeText={setLicensePlate} 
                style={styles.input}
                autoCapitalize="characters"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Kleur</Text>
              <TouchableOpacity 
                style={styles.colorButton}
                onPress={() => setShowColorPicker(!showColorPicker)}
              >
                <Text style={styles.colorButtonText}>
                  {selectedColorObj ? selectedColorObj.name : "Selecteer kleur"}
                </Text>
                <Text style={styles.dropdownArrow}>{showColorPicker ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {/* Color Picker Grid */}
              {showColorPicker && (
                <View style={styles.colorGrid}>
                  {CAR_COLORS.map((colorOption) => (
                    <TouchableOpacity
                      key={colorOption.value}
                      style={[
                        styles.colorCircle,
                        color === colorOption.value && styles.colorCircleActive
                      ]}
                      onPress={() => {
                        setColor(colorOption.value);
                        setShowColorPicker(false);
                      }}
                    >
                      <Image 
                        source={colorOption.icon} 
                        style={styles.colorIcon} 
                        resizeMode="contain"
                      />
                      <Text style={styles.colorName}>{colorOption.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleAddCar}
              disabled={loading}
            >
              <Text style={styles.addButtonText}>
                {loading ? "Bezig..." : "✓ Auto toevoegen"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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

  // Preview
  previewSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  carPreview: {
    width: 150,
    height: 150,
  },

  // Form
  formCard: {
    backgroundColor: "#E3F5FF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0054BB",
    marginBottom: 8,
    marginTop: 12,
    fontFamily: 'Urbanist_600SemiBold',
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B8E6FF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#0054BB",
    fontFamily: 'Urbanist_400Regular',
  },
  colorButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B8E6FF",
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorButtonText: {
    fontSize: 16,
    color: "#0054BB",
    fontFamily: 'Urbanist_400Regular',
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#5C5C5C",
  },

  // Color Grid
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  colorCircle: {
    width: 70,
    alignItems: "center",
    margin: 6,
  },
  colorCircleActive: {
    backgroundColor: "#B8E6FF",
    borderRadius: 12,
    padding: 8,
  },
  colorIcon: {
    width: 60,
    height: 60,
  },
  colorName: {
    fontSize: 10,
    color: "#0054BB",
    textAlign: "center",
    marginTop: 4,
  },

  // Add Button
  addButton: {
    backgroundColor: "#0054BB",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    marginHorizontal: 20,
  },
  addButtonDisabled: { backgroundColor: "#0054BB" },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'Urbanist_700Bold',
  },
});