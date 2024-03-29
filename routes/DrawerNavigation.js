import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import GoodsInformation from "../Screens/GoodsInformation";
import Setting from "../Screens/Setting";
import { Image, Text, View } from "react-native";
import BarcodeScanner from "../Screens/BarcodeScan/BarcodeScanner";
import GoodsDetail from "../Screens/GoodsDetail";
import AuthContext from "../auth/context/auth";
import React, { useContext, useEffect, useState } from "react";
import { I18n } from "i18n-js";
import { translations } from "../Language/menu_lang";
import { getStorageData } from "../StorageUtil";
import PinCode from "../Screens/PinCode";
import RouteBarcodeScanner from "../Screens/BarcodeScan/RouteBarcodeScanner";

const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  const { signed, user, signOut } = useContext(AuthContext);

  let [locale, setLocale] = useState("");
  const i18n = new I18n(translations);
  i18n.enableFallback = true;
  i18n.locale = locale;

  useEffect(() => {
    const fetch = async () => {
      const lang = await getStorageData("language");
      setLocale(lang);
    };

    fetch();
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => (
        <Content {...props} signOut={signOut} locale={locale} i18n={i18n} />
      )}
    >
      <Drawer.Screen
        name="Home"
        options={{ title: i18n.t("home") }}
        component={RouteBarcodeScanner}
      />
      <Drawer.Screen
        name="PinCode"
        options={{ unmountOnBlur: true, title: "PinCode" }}
        component={PinCode}
      />
      <Drawer.Screen
        name="GoodsInformation"
        options={{ unmountOnBlur: true, title: i18n.t("goodsInformation") }}
        component={GoodsInformation}
      />
      <Drawer.Screen
        name="Setting"
        options={{ title: i18n.t("setting") }}
        component={Setting}
      />
      <Drawer.Screen
        name="GoodsDetail"
        options={{ title: i18n.t("productdetail") }}
        component={GoodsDetail}
      />

      <Drawer.Screen
        name="BarcodeScanner"
        options={{ unmountOnBlur: true }}
        component={BarcodeScanner}
      />
    </Drawer.Navigator>
  );
};

const Content = (props) => (
  <View style={{ flex: 1 }}>
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: 200, height: 100, borderRadius: 20 }}
        source={require("../assets/logo.png")}
      />
    </View>
    <View style={{ flex: 4 }}>
      <View style={{ flex: 12 }}>
        <DrawerContentScrollView showsVerticalScrollIndicator={false}>
          <DrawerItem
            icon={() => (
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../assets/menu.png")}
              />
            )}
            label={props.i18n.t("home")}
            onPress={() => props.navigation.navigate("Home")}
          />
          <DrawerItem
            icon={() => (
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../assets/procurement.png")}
              />
            )}
            label={props.i18n.t("goodsInformation")}
            onPress={() => props.navigation.navigate("GoodsInformation")}
          />
          <DrawerItem
            icon={() => (
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../assets/gear.png")}
              />
            )}
            label={props.i18n.t("setting")}
            onPress={() => props.navigation.navigate("Setting")}
          />
          <DrawerItem
            icon={() => (
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../assets/logout.png")}
              />
            )}
            label={props.i18n.t("exit")}
            onPress={() => props.signOut()}
          />
        </DrawerContentScrollView>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "gray", marginBottom: 10 }}>© FotonTech 2024 </Text>
      </View>
    </View>
  </View>
);
