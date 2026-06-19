import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../api/api";
import { RootStackParamList } from "../../../App";

type Produto = {
  id: number;
  nomeprod: string;
  descricao?: string;
  valor: number;
  idcategoria?: number;
};

type Categoria = {
  id: number;
  nome: string;
  ativo?: boolean;
};

export default function Produtos() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Produtos">>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [valorProduto, setValorProduto] = useState("");
  const [idCategoria, setIdCategoria] = useState<number | null>(null);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  useEffect(() => {
    loadData();
    loadCategorias();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const response = await api.get("/produtos");
      const lista = response.data.produtos || [];
      const data = lista.map((p: any) => ({
        ...p,
        valor: Number(p.valor),
      }));
      setProdutos(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCategorias() {
    try {
      const response = await api.get("/categorias");
      const listaCategorias = response.data.categorias || [];
      setCategorias(listaCategorias);
      if (listaCategorias.length > 0) {
        setIdCategoria(listaCategorias[0].id);
      }
    } catch (error) {
      console.log("Erro ao carregar categorias:", error);
    }
  }

  async function salvar() {
    try {
      if (!nomeProduto.trim() || nomeProduto.trim().length < 3) {
        Alert.alert("Atenção", "O nome do produto deve ter pelo menos 3 caracteres.");
        return;
      }

      if (!/^[a-zA-ZÀ-ú0-9\s\-.,()]+$/.test(nomeProduto.trim())) {
        Alert.alert("Atenção", "O nome do produto contém caracteres inválidos.");
        return;
      }

      const precoNumerico = Number.parseFloat(valorProduto.replace(",", "."));
      if (!valorProduto.trim() || isNaN(precoNumerico) || precoNumerico <= 0) {
        Alert.alert("Atenção", "Informe um preço válido maior que zero.");
        return;
      }

      if (precoNumerico > 99999999.99) {
        Alert.alert("Atenção", "O preço máximo permitido é R$ 99.999.999,99.");
        return;
      }

      if (!idCategoria) {
        Alert.alert("Atenção", "Selecione uma categoria.");
        return;
      }

      if (selectedProduto) {
        await api.patch(`/produtos/${selectedProduto.id}`, {
          nome: nomeProduto,
          preco: precoNumerico,
          categoriaId: idCategoria,
          descricao: selectedProduto.descricao ?? "",
        });
      } else {
        await api.post("/produtos", {
          nome: nomeProduto,
          preco: precoNumerico,
          categoriaId: idCategoria,
        });
      }

      closeModal();
      await loadData();
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  function openCreate() {
    setSelectedProduto(null);
    setNomeProduto("");
    setValorProduto("");
    if (categorias.length > 0) {
      setIdCategoria(categorias[0].id);
    }
    setModalVisible(true);
  }

  function openEdit(item: Produto) {
    setSelectedProduto(item);
    setNomeProduto(item.nomeprod);
    setValorProduto(String(item.valor));
    if (item.idcategoria) {
      setIdCategoria(Number(item.idcategoria));
    }
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedProduto(null);
    setNomeProduto("");
    setValorProduto("");
  }

  async function handleDelete(id: number) {
    Alert.alert(
      "Excluir produto",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/produtos/${id}`);
              await loadData();
            } catch (error: any) {
              Alert.alert("Erro ao excluir", "Não foi possível excluir este produto.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.containerPrincipal}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNovo} onPress={openCreate} activeOpacity={0.8}>
            <Text style={styles.txtBtnNovo}>+ Novo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.titulo}>Produtos</Text>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="cube-outline" size={44} color="#C7C7CC" />
            <Text style={styles.emptyTxt}>Nenhum produto cadastrado</Text>
          </View>
        }
        renderItem={({ item }) => {
          const catNome = categorias.find((c) => c.id === item.idcategoria)?.nome || "Sem categoria";
          return (
            <View style={styles.cardProduto}>
              <View style={styles.thumbWrap}>
                <Ionicons name="cube-outline" size={24} color="#C7C7CC" />
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.nomeProduto} numberOfLines={2}>
                  {item.nomeprod}
                </Text>
                <Text style={styles.nomeCategoria}>{catNome}</Text>
                <Text style={styles.textoPreco}>
                  R$ {item.valor.toFixed(2)}
                </Text>
              </View>

              <View style={styles.acoesCard}>
                <TouchableOpacity onPress={() => openEdit(item)} activeOpacity={0.5}>
                  <Ionicons name="pencil" size={19} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  activeOpacity={0.5}
                  style={{ marginTop: 16 }}
                >
                  <Ionicons name="trash-outline" size={19} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.handle} />

            <Text style={styles.modalTitulo}>
              {selectedProduto ? "Editar produto" : "Novo produto"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.labelInput}>NOME</Text>
              <TextInput
                style={styles.input}
                value={nomeProduto}
                onChangeText={setNomeProduto}
                placeholder="Ex: Caderno Universitário"
                placeholderTextColor="#C7C7CC"
              />

              <Text style={styles.labelInput}>PREÇO (R$)</Text>
              <TextInput
                style={styles.input}
                value={valorProduto}
                onChangeText={setValorProduto}
                placeholder="0,00"
                placeholderTextColor="#C7C7CC"
                keyboardType="decimal-pad"
              />

              <Text style={styles.labelInput}>CATEGORIA</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
              >
                {categorias.map((cat) => {
                  const sel = idCategoria === cat.id;
                  return (
                    <TouchableOpacity
                      key={String(cat.id)}
                      style={[styles.chipCategoria, sel && styles.chipCategoriaAtiva]}
                      onPress={() => setIdCategoria(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.txtChipCat, sel && styles.txtChipCatAtivo]}>
                        {cat.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={styles.btnSalvar} onPress={salvar} activeOpacity={0.85}>
                <Text style={styles.txtBtnSalvar}>
                  {selectedProduto ? "Salvar alterações" : "Cadastrar produto"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closeModal} style={styles.btnCancelar}>
                <Text style={styles.txtBtnCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  btnVoltar: {
    marginLeft: -6,
    padding: 4,
  },
  btnNovo: {
    backgroundColor: "#007AFF",
    borderRadius: 17,
    height: 34,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  txtBtnNovo: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  lista: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  cardProduto: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  thumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  cardInfo: {
    flex: 1,
  },
  nomeProduto: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 3,
  },
  nomeCategoria: {
    fontSize: 13,
    color: "#8E8E93",
    textTransform: "uppercase",
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  textoPreco: {
    fontSize: 15,
    color: "#8E8E93",
  },
  acoesCard: {
    alignItems: "center",
    paddingLeft: 12,
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 80,
    gap: 10,
  },
  emptyTxt: {
    fontSize: 15,
    color: "#8E8E93",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    maxHeight: "92%",
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  labelInput: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 17,
    color: "#1C1C1E",
    marginBottom: 20,
  },
  chipCategoria: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  chipCategoriaAtiva: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  txtChipCat: {
    fontSize: 14,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  txtChipCatAtivo: {
    color: "#FFFFFF",
  },
  btnSalvar: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },
  txtBtnSalvar: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  btnCancelar: {
    alignItems: "center",
    paddingVertical: 14,
  },
  txtBtnCancelar: {
    fontSize: 17,
    color: "#8E8E93",
  },
});
