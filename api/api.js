import axios from "axios";
import { getStorageData, removeStorageData, storeData } from "../StorageUtil";
import { useContext } from "react";
import AuthContext from "../auth/context/auth";
import Toast from "react-native-root-toast";

const api = axios.create({
  baseURL: "http://188.213.212.194/api",
});
export const AuthInterceptor = () => {
    const { signOut } = useContext(AuthContext);

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        try {
          const refreshTokenStage = await getStorageData(
            "@RNAuth:refreshToken"
          );
          const response = await axios.post(
            "http://188.213.212.194/api/Auth/refresh",
            {
              refreshToken: refreshTokenStage,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { token, refreshToken } = response.data;

          await storeData("@RNAuth:token", token);
          await storeData("@RNAuth:refreshToken", refreshToken);

          originalRequest.headers.Authorization = `Bearer ${token}`;

          return axios(originalRequest);
        } catch (error) {

          Toast.show(error.response.data.message)
          signOut();
          removeStorageData("@RNAuth:token");
          removeStorageData("@RNAuth:refreshToken");
        }
      }

      return Promise.reject(error);
    }
  );
  return null;
};

export default api;
