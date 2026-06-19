import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/Home";
import Produtos from "./src/screens/Produtos";
import CategoriaScreen from "./src/screens/Categorias";
import Login from "./src/screens/Login";
import api from "./src/api/api";

export type RootStackParamList = {
  Home: undefined;
  Produtos: undefined;
  CategoriaScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [autenticado, setAutenticado] = useState(false);

  function handleLogin(token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAutenticado(true);
  }

  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Produtos"
          component={Produtos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoriaScreen"
          component={CategoriaScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
