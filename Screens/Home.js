import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons,MaterialIcons  } from "@expo/vector-icons";
import ProductServices from "../api/services/ProductServices";
import GoodsStockServices from "../api/services/GoodsStockServices";
import { getStorageData } from "../StorageUtil";
import { I18n } from "i18n-js";
import { translations } from "../Language/home_page";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";

export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [code, setCode] = useState("");
  const navigation = useNavigation();
  const [storegeToken, setStoregeToken] = useState("");
  const [loadingbtn, setLoadingbtn] = useState(false);

  let [locale, setLocale] = useState("");
  const i18n = new I18n(translations);
  i18n.enableFallback = true;
  i18n.locale = locale;

  useEffect(() => {
    const fetch = async () => {
      const lang = await getStorageData("language");
      setLocale(lang);
      const storageTokenTemp = await getStorageData("@RNAuth:refreshToken");
      setStoregeToken(storageTokenTemp);
    };

    fetch();
  }, []);

  const handleImagePress = () => {
    navigation.navigate('MyModal')
  };
  const searchClick = async () => {
    setLoadingbtn(true);
    const storageToken = await getStorageData("@RNAuth:token");

    if (code.length > 0) {
      const productInfo = await ProductServices.getProductInformationBycode(
        code,
        storageToken,
        setLoadingbtn
      );

      if (productInfo.data) {
        const productStockCount =
          await GoodsStockServices.getGoodsStockByBarcode(
            productInfo.data.productBarcode,
            storageToken
          );
        if (productStockCount.data) {
          navigation.navigate("GoodsDetail", {
            productInfo: productInfo.data,
            productStock: productStockCount.data,
          });
        }
      } else {
        Toast.show("Məlumat tapılmadı");
      }
    } else if (barcode.length > 0) {

      const productInfo = await ProductServices.getProductInformation(
        barcode,
        storageToken,
        setLoadingbtn
      );

      if (productInfo.data) {
        const productStockCount =
          await GoodsStockServices.getGoodsStockByBarcode(
            barcode,
            storageToken
          );
        if (productStockCount.data) {
          navigation.navigate("GoodsDetail", {
            productInfo: productInfo.data,
            productStock: productStockCount.data,
          });
        }
      } else {
        Toast.show("Məlumat tapılmadı");
      }
    } else {
      Toast.show("Məlumat daxil elilməyib");
    }
      setLoadingbtn(false);
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="code-greater-than"
              size={47}
              color="#803535"
            />
            <TextInput
              style={styles.input}
              onChangeText={setCode}
              value={code}
              placeholder={i18n.t("enterprocode")}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons name="barcode-outline" size={50} color="#803535" />
            <TextInput
              style={styles.input}
              onChangeText={setBarcode}
              value={barcode}
              placeholder={i18n.t("enterbarcode")}
            />
          </View>
          <TouchableOpacity disabled={loadingbtn} onPress={searchClick} style={styles.button}>
            <Text style={styles.buttonText}>
              {loadingbtn ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                i18n.t("searchbtn")
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.scanButton}>
          <TouchableOpacity onPress={handleImagePress}>
          <MaterialIcons name="barcode-reader" size={65} color="#803535" />
            {/* <Image
              source={require("../assets/menu.png")}
              style={styles.scanIcon}
            /> */}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 250,
    height: 120,
    borderRadius: 20,
  },
  inputContainer: {
    flex: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 15,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#803535",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
  },
  scanButton: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 35,
  },
  scanIcon: {
    width: 70,
    height: 70,
  },
});
