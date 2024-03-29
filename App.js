import { StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { AuthProvider } from "./auth/context/auth";
import Routes from "./routes/index";
import { AuthInterceptor } from "./api/api";
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {

  return (
    <RootSiblingParent> 
    <NavigationContainer>
      
      <StatusBar />

      <AuthProvider>
      <AuthInterceptor />

        <Routes />
      </AuthProvider>
    </NavigationContainer>
    </RootSiblingParent> 
  );
}

const styles = StyleSheet.create({});
