import React, { createContext, useState, useEffect } from "react";
import {
  getStorageData,
  storeData,
  removeStorageData,
} from "../../StorageUtil";
import UserServices from "../../api/services/UserServices";
import Toast from "react-native-root-toast";

const AuthContext = createContext({ signed: false, user: {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {

      const storageUser = await getStorageData("@RNAuth:token");
      const storageToken = await getStorageData("@RNAuth:refreshToken");

      let data = JSON.stringify({
        refreshToken: storageToken,
      });

      if (storageUser && storageToken) {
        setUser(storageUser);
        setLoading(false);
      } else if (!storageUser && !storageToken) {
      
        setUser(null);
        setLoading(false);
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(username, password) {
    const data = JSON.stringify({
      userName: username,
      password: password,
    });

    try {
      const response = await UserServices.login(data);
      
      setUser(response.data);
      await storeData("@RNAuth:token", response.data.token);
      await storeData("@RNAuth:refreshToken", response.data.refreshToken);
    } 
    catch (error) {
      Toast.show("error")
    }
  }

  function signOut() {
    removeStorageData("@RNAuth:refreshToken").then(() => {
      setUser(null);
    });
    removeStorageData("@RNAuth:token").then(() => {
      setUser(null);
    });
    removeStorageData("biometric");
    removeStorageData("isPinCode");
    removeStorageData("language");
    removeStorageData("pinCode");
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
