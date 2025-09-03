import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "AddBus">;

export default function AddBusScreen({ route, navigation }: Props) {
  const { routeId } = route.params;
  const [busNumber, setBusNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSaveBus = async () => {
    try {
      const res = await api.post("/bus/add", {
        busNumber,
        capacity: Number(capacity),
        route: routeId,
      });
      Alert.alert("Success", "Bus registered!");
      navigation.replace("Home", { busId: res.data._id });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bus Number</Text>
      <TextInput style={styles.input} value={busNumber} onChangeText={setBusNumber} />
      <Text>Capacity</Text>
      <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
      <Button title="Save Bus" onPress={handleSaveBus} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 6 },
});
