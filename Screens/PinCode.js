import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { SafeAreaView, StatusBar, Text } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import { storeData, getStorageData } from "../StorageUtil";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

const PinCode = ({ location, setIsLock, route }) => {
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [confirmpin, setConfirmPin] = useState("");
  const [pinPass, setPinPass] = useState("");
   const navigation = useNavigation();

  const getInit = async ()=>{
    const pincode = await getStorageData("pinCode");
    setPinPass(pincode);
  }
  useEffect(() => {
   getInit();
  }, []);

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length === 4) {
      if (location == "login") {
        
        if (enteredPin === pinPass) {
          setIsLock(true);
        } else {
          setEnteredPin("");
          pinView.current.clearAll();
        }
      } else if (route.params?.location == "changepin") {
        if (confirmpin.length>0) {
          if (confirmpin == enteredPin ) {
            storeData("pinCode", confirmpin);
            navigation.navigate("Setting")
          } else {
            Toast.show("Pin yalnışdır təkrar edin");
          }
        }
        else{
          setConfirmPin(enteredPin);

        }
    
        setEnteredPin("");
        pinView.current.clearAll();
      }
    }
  }, [enteredPin]);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {location == "login" ? (
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
          </View>
        ) : (
          confirmpin.length>0?
         <Text>Pin-i təkrar edin</Text>:
         <Text>Pin-i dəyişin</Text>
        )}

        <ReactNativePinView
          inputSize={25}
          ref={pinView}
          pinLength={4}
          buttonSize={70}
          onValueChange={(value) => setEnteredPin(value)}
          buttonAreaStyle={{
            marginTop: 14,
          }}
          inputAreaStyle={{
            marginBottom: 24,
          }}
          inputViewEmptyStyle={{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#803535",
          }}
          inputViewFilledStyle={{
            backgroundColor: "#803535",
          }}
          buttonViewStyle={{
            borderWidth: 1,
            borderColor: "#803535",
          }}
          buttonTextStyle={{
            color: "#803535",
          }}
          onButtonPress={(key) => {
            if (key === "custom_left") {
              pinView.current.clear();
            }
          }}
          customLeftButton={
            showRemoveButton ? (
              <Ionicons name="backspace" size={36} color="#803535" />
            ) : undefined
          }
        />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 1,
    paddingBottom: 48,
  },
  logo: {
    width: 250,
    height: 120,
    borderRadius: 20,
  },
});
export default PinCode;
