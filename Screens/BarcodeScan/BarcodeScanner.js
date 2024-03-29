import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, FlashMode } from "expo-camera";
import ProductServices from "../../api/services/ProductServices";
import GoodsStockServices from "../../api/services/GoodsStockServices";
import { getStorageData } from "../../StorageUtil";

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);

  const navigation = useNavigation();

  const getInit=async()=>{
    const test = await Camera.requestCameraPermissionsAsync();
    const { status } = await Camera.getCameraPermissionsAsync();
    setHasPermission(status === "granted");
  }

  useEffect(() => {
    getInit()
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            style={styles.backIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!hasPermission) {
    return <View />;
  }
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const storageToken = await getStorageData("@RNAuth:token");

    const productInfo = await ProductServices.getProductInformation(
      data,
      storageToken
    );
    
    const productStockCount = await GoodsStockServices.getGoodsStockByBarcode(
      data,
      storageToken
    );

    if (productInfo.data) {
      navigation.navigate("GoodsDetail", {
        productInfo: productInfo.data,
        productStock: productStockCount.data,
      });
    } else {
      alert("Data Yoxdur")
      setScanned(false);
    }
  };

  const flashOnOff = () => {
    setFlash(!flash);
  };

  if (!hasPermission.granted) {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          flashMode={flash ? FlashMode.torch : FlashMode.off}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.flashBtnView}>
            <TouchableOpacity style={styles.flashIcon} onPress={flashOnOff}>
              {flash ? (
                <Ionicons name="flashlight" size={40} color="#4e9bde" />
              ) : (
                <Ionicons name="flashlight-outline" size={40} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.closeBtnView}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => navigation.goBack()}
            >
              {flash ? (
                <Ionicons name="close" size={40} color="#4e9bde" />
              ) : (
                <Ionicons name="close" size={40} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },

  camera: {
    width: "100%",
    height: "100%",
  },
  backIcon: {
    padding: 15,
  },
  flashIcon: {
    borderRadius: 50,
    backgroundColor: "black",
    opacity: 0.7,
    padding: 10,
  },
  flashBtnView: {
    borderRadius: 50,
    position: "absolute",
    bottom: 25,
    left: 25,
  },
  closeIcon: {
    borderRadius: 50,
    backgroundColor: "black",
    opacity: 0.7,
    padding: 10,
  },
  closeBtnView: {
    borderRadius: 50,
    position: "absolute",
    bottom: 25,
    right: 25,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
