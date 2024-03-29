import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getStorageData, storeData } from "../StorageUtil";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { I18n } from "i18n-js";
import { translations } from "../Language/setting_lang";

const LanguageItems = [
  { value: "en", label: "EN" },
  { value: "az", label: "AZ" },
  { value: "ru", label: "RU" },
];

export default function Setting() {
  const [biometric, setBiometric] = useState(false);
  const [pinCode, setPinCode] = useState(false);
  const [pinPass, setPinPass] = useState("");

  const [isOpenLanguageModal, setIsLanguageModal] = useState(false);
  const [language, setLanguage] = useState();
  const navigation = useNavigation();

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

  useEffect(() => {
    const fetchData = async () => {
      if (language) {
        await storeData("language", language);
      }
    };

    fetchData();
  }, [language]);
  useEffect(() => {
    const fetchData = async () => {
      const checkBiometric = await getStorageData("biometric");
      const pinCode = await getStorageData("isPinCode");
      const lang = await getStorageData("language");
      const pinPassTemp = await getStorageData("pinCode");
      setLanguage(lang);
      setPinPass(pinPassTemp)
      if (checkBiometric == "enable") {
        setBiometric(true);
      } else {
        setBiometric(false);
      }
      if (pinCode == "enable") {
        setPinCode(true);
      } else {
        setPinCode(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.profile}></View>

        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#fe9400" }]}>
                <FeatherIcon color="#fff" name="globe" size={20} />
              </View>

              <Text style={styles.rowLabel}>{i18n.t("language")}</Text>

              <View style={styles.rowSpacer} />
              <View style={styles.languageDDPView}>
                <DropDownPicker
                  items={LanguageItems}
                  style={styles.DropDownPicker}
                  open={isOpenLanguageModal}
                  setOpen={() => setIsLanguageModal(!isOpenLanguageModal)}
                  value={language}
                  setValue={(val) => {
                    setLanguage(val);
                  }}
                  maxHeight={200}
                  autoScroll
                  placeholder="select"
                  mode="BADGE"
                  listMode="MODAL"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
                <Entypo name="fingerprint" size={20} color="#fff" />
                {/* <FeatherIcon color="#fff" name="moon" size={20} /> */}
              </View>

              <Text style={styles.rowLabel}>{i18n.t("biometric")}</Text>

              <View style={styles.rowSpacer} />

              <Switch
              disabled={pinCode==true? false:true}
                onValueChange={(value) => {
                  setBiometric(value);
                  if (value) {
                    storeData("biometric", "enable");
                  } else {
                    storeData("biometric", "disabled");
                  }
                }}
                value={biometric}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PinCode",{
                  location:"changepin",
                   setIsLock:false
                })
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#32c759" }]}>
                <MaterialIcons name="password" size={24} color="white" />
              </View>

              <Text style={styles.rowLabel}>Change Pin </Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#8e8d91" }]}>
                <Ionicons name="key-outline" size={20} color="#fff" />
              </View>

              <Text style={styles.rowLabel}>PassCode</Text>

              <View style={styles.rowSpacer} />

              <Switch disabled={pinPass?.length==4 ? false: true}
                onValueChange={(value) => {
                  setPinCode(value);
                  if (value) {
                    storeData("isPinCode", "enable");
                  } else {
                    storeData("isPinCode", "disabled");
                    storeData("biometric", "disabled");
                    setBiometric(false)
                  }
                }}
                value={pinCode}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  languageDDPView: {
    maXWidth: 5,
    height: 50,
  },
  DropDownPicker: {
    minWidth: "30%",
    backgroundColor: "#f2f2f2",
    borderWidth: 0,
  },
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Profile */
  profile: {
    padding: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarWrapper: {
    position: "relative",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    color: "#414d63",
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: "#989898",
    textAlign: "center",
  },
  /** Section */
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
