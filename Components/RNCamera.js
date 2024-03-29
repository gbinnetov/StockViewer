import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Camera } from "expo-camera";

export default function RNCamera({}) {
  const [scanned, setScanned] = useState(false);
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
  };

  return (
    <View>
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.barcodeMask}>
        </View>
      </Camera>
      {scanned && (
        <Button title={"Yeniden Tara"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
