import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import UserServices from "../../api/services/UserServices";
import AuthContext from "../../auth/context/auth";
import { storeData } from "../../StorageUtil";
import Toast from "react-native-root-toast";

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const [ isLoading, setIsLoading ] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleSignIn() {
    setIsLoading(true)
   
    const data = JSON.stringify({
      userName: form.email,
      password: form.password,
    });

    UserServices.login(data)
      .then((res) => {
        if (res.status == 200) {
          storeData("biometric", "disabled");
          storeData("language", "az");
          storeData("isPinCode", "disabled");
          storeData("pinCode", "");
          signIn(form.email, form.password);
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
          Toast.show("İstifadəçi məlumatları düzgün deyil");
        }
      });
      setTimeout(() => {
        setIsLoading(false)
        
      }, 1000);
      
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>FotonTech</Text>

          <Text style={styles.subtitle}>Hesabınıza daxil olun </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>İstifadəçi adı</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="İstifadəçi adı"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Şifrə</Text>

            <TextInput
              autoCorrect={false}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
            disabled={isLoading}
              onPress={() => {
                handleSignIn();
              }}
            >
              <View style={styles.btn}>
                <Text>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Daxil ol</Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
        >
          <Text style={{ color: "#878787" }}>
            © 2024 Bütün hüquqlar qorunur.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  /** Form */
  form: {
    marginBottom: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 151,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#803535",
    borderColor: "white",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
