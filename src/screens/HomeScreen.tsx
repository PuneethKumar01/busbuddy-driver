import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Alert } from "react-native";
import * as Location from "expo-location";
import api from "../api";

export default function HomeScreen({ route }: any) {
  const { busId } = route.params;
  const [bus, setBus] = useState<any>(null);
  const [busRoute, setBusRoute] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const busRes = await api.get(`/bus/${busId}`);
setBus(busRes.data);
setBusRoute(busRes.data.route); // route is already populated

      } catch (err: any) {
        Alert.alert("Error", err.message);
        console.log('yash')
        console.log(err);
         if (err.response) {
    console.log("Status:", err.response.status);      // e.g. 404
    console.log("Data:", err.response.data);          // backend error message
    console.log("Headers:", err.response.headers);    // optional
  } else if (err.request) {
    console.log("No response received:", err.request);
  } else {
    console.log("Error message:", err.message);
  }

      }
    };
    fetchData();

    let locationSub: Location.LocationSubscription | null = null;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is needed.");
        return;
      }
      locationSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        async (loc) => {
          try {
            await api.post("/location/update", {
              bus: busId,
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          } catch (err) {
            console.log("Location update error", err);
          }
        }
      );
    })();

    return () => {
      locationSub?.remove();
    };
  }, [busId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>

      {bus && (
        <View style={styles.card}>
          <Text style={styles.heading}>Bus Info</Text>
          <Text>Bus Number: {bus.busNumber}</Text>
          <Text>Capacity: {bus.capacity}</Text>
        </View>
      )}

      {busRoute && (
        <View style={styles.card}>
          <Text style={styles.heading}>Route Info</Text>
          <Text>Route: {busRoute.routeNumber}</Text>
          <Text>
            {busRoute.startLocation} ➝ {busRoute.endLocation}
          </Text>
          <Text style={styles.heading}>Stops:</Text>
          <FlatList
            data={busRoute.stops}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <Text>{index + 1}. {item}</Text>}
          />
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Tracking Active" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: { padding: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 20 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});
