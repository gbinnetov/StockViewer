import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { getStorageData } from "../StorageUtil";
import "react-native-gesture-handler";

import { DrawerNavigation } from "./DrawerNavigation";
import AuthRoutes from "./auth.routes";

import AuthContext from "../auth/context/auth";
import PinCode from "../Screens/PinCode";
import Toast from "react-native-root-toast";

const Routes = () => {
  const { signed, loading } = useContext(AuthContext);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isLock, setIsLock] = useState(false);
  const getInit = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  useEffect(() => {
    getInit();
  });

  useEffect(() => {
    const fetchData = async () => {
      const checkBiometric = await getStorageData("biometric");
      const checkPinPage = await getStorageData("isPinCode");
      checkPinPage == "enable" ? setIsLock(false) : setIsLock(true);
      checkBiometric == "enable" ?  await handleBiometricAuth() : null;

    };
    fetchData();
  }, []);

  const fallBackToDefaultAuth = () => {
    console.log("fall back to password authenticaiton");
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Toast.show(title, mess, [{ text: btnTxt, onPress: btnFunc }]);
  };

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    if (!isBiometricAvailable)
      return alertComponent(
        "Please Enter Your Password",
        "Biometric Auth not supported",
        "Ok",
        () => fallBackToDefaultAuth()
      );

    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        "Biometric record not found",
        "Please Login With Password",
        "Ok",
        () => fallBackToDefaultAuth()
      );

    let biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login With Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (biometricAuth.success) {
      setIsLock(true)
    }

  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItem: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return signed ? (
    isLock ? (
      <DrawerNavigation />
    ) : (
      <PinCode location={"login"} setIsLock={setIsLock} />
    )
  ) : (
    <AuthRoutes />
  );
};

export default Routes;
