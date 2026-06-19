import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerArea}>
        <Text style={styles.appTitle}>StockFlow</Text>
        <Text style={styles.appSubtitle}>Gerencie seus produtos e categorias</Text>
      </View>

      <View style={styles.menuArea}>
        <TouchableOpacity
          style={styles.cardNav}
          onPress={() => navigation.navigate("Produtos")}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="cube-outline" size={22} color="#007AFF" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitulo}>Produtos</Text>
            <Text style={styles.cardDesc}>Catálogo, preços e imagens</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardNav}
          onPress={() => navigation.navigate("CategoriaScreen")}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="folder-outline" size={22} color="#007AFF" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitulo}>Categorias</Text>
            <Text style={styles.cardDesc}>Organize por grupos</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
  },
  menuArea: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardNav: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: "#8E8E93",
  },
});
