import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "AddRoute">;

export default function AddRouteScreen({ navigation }: Props) {
  const [routeNumber, setRouteNumber] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stops, setStops] = useState("");

  const handleSaveRoute = async () => {
    try {
      const res = await api.post("/route/add", {
        routeNumber,
        startLocation,
        endLocation,
        stops: stops.split(",").map(s => s.trim()),
      });
      Alert.alert("Success", "Route created!");
      navigation.replace("AddBus", { routeId: res.data._id });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Route Number</Text>
      <TextInput style={styles.input} value={routeNumber} onChangeText={setRouteNumber} />
      <Text>Start Location</Text>
      <TextInput style={styles.input} value={startLocation} onChangeText={setStartLocation} />
      <Text>End Location</Text>
      <TextInput style={styles.input} value={endLocation} onChangeText={setEndLocation} />
      <Text>Stops (comma separated)</Text>
      <TextInput style={styles.input} value={stops} onChangeText={setStops} />
      <Button title="Save Route" onPress={handleSaveRoute} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 6 },
});
