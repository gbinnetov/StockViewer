import { StyleSheet } from "react-native";
import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import Home from "../Home";
import BarcodeScanner from "./BarcodeScanner";

const RootStack = createStackNavigator();

export default function RouteBarcodeScanner() {

  return (
    <RootStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "vertical",
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      }}
    >
      <RootStack.Group>
        <RootStack.Screen name="HomeScreen" options={{headerShown:false}} component={Home} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: "modal" }}>
        <RootStack.Screen options={{headerShown:false}} name="MyModal" component={BarcodeScanner} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({});
