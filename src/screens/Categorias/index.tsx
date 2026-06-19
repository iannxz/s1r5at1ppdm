import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../api/api";

// backend retorna: { id, nome, ativo }
type CategoriaAPI = {
  id: number;
  nome: string;
  ativo?: boolean;
};

export default function CategoriaScreen() {
  const insets = useSafeAreaInsets();
  const [categorias, setCategorias] = useState<CategoriaAPI[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaAPI | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.get("/categorias");
      setCategorias(response.data.categorias || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!nomeCategoria.trim() || nomeCategoria.trim().length < 3) {
      Alert.alert("Atenção", "O nome da categoria deve ter pelo menos 3 caracteres.");
      return;
    }

    if (!/^[a-zA-ZÀ-ú0-9\s\-.,()]+$/.test(nomeCategoria.trim())) {
      Alert.alert("Atenção", "O nome da categoria contém caracteres inválidos.");
      return;
    }
    try {
      if (selectedCategoria) {
        await api.patch(`/categorias/${selectedCategoria.id}`, {
          nome: nomeCategoria,
          ativo: true,
        });
      } else {
        await api.post(`/categorias`, {
          nome: nomeCategoria,
        });
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
    }
  }

  function openCreate(): void {
    setSelectedCategoria(null);
    setNomeCategoria("");
    setModalVisible(true);
  }

  function openEdit(item: CategoriaAPI): void {
    setSelectedCategoria(item);
    setNomeCategoria(item.nome);
    setModalVisible(true);
  }

  function closeModal(): void {
    setModalVisible(false);
    setSelectedCategoria(null);
    setNomeCategoria("");
  }

  async function handleDelete(id: number): Promise<void> {
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta categoria?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/categorias/${id}`);
            await loadData();
          } catch (error) {
            console.error(error);
            Alert.alert(
              "Erro ao excluir",
              "Não foi possível excluir esta categoria — ela pode ter produtos vinculados."
            );
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.tela}>
      <StatusBar style="dark" />
      <View style={[styles.headerCategorias, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.tituloPagina}>Categorias</Text>
        <TouchableOpacity style={styles.btnNovaCat} onPress={openCreate} activeOpacity={0.8}>
          <Text style={styles.txtBtnNovaCat}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listaCats}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Ionicons name="folder-open-outline" size={44} color="#C7C7CC" />
              <Text style={styles.emptyMsg}>Nenhuma categoria cadastrada</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cardCategoria}>
              <View style={styles.infoCategoria}>
                <Text style={styles.idBadge}>#{item.id}</Text>
                <Text style={styles.nomeCategoria}>{item.nome}</Text>
              </View>
              <View style={styles.acoesCategoria}>
                <TouchableOpacity
                  onPress={() => openEdit(item)}
                  activeOpacity={0.5}
                  style={styles.btnEditar}
                >
                  <Ionicons name="pencil" size={19} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  activeOpacity={0.5}
                  style={styles.botaoExcluir}
                >
                  <Ionicons name="trash-outline" size={19} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlayModal}
        >
          <View style={styles.sheetModal}>
            <View style={styles.dragHandle} />

            <Text style={styles.tituloModal}>
              {selectedCategoria ? "Editar categoria" : "Nova categoria"}
            </Text>

            <Text style={styles.labelCampo}>NOME</Text>
            <TextInput
              placeholder="Ex: Eletrônicos, Roupas..."
              placeholderTextColor="#C7C7CC"
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
              style={styles.campoInput}
              autoFocus
            />

            <TouchableOpacity style={styles.btnConfirmar} onPress={salvar} activeOpacity={0.85}>
              <Text style={styles.txtConfirmar}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} style={styles.btnCancelarModal}>
              <Text style={styles.txtCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  headerCategorias: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#F2F2F7",
  },
  tituloPagina: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  btnNovaCat: {
    backgroundColor: "#007AFF",
    borderRadius: 17,
    height: 34,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  txtBtnNovaCat: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listaCats: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyView: {
    alignItems: "center",
    marginTop: 80,
    gap: 10,
  },
  emptyMsg: {
    fontSize: 15,
    color: "#8E8E93",
  },
  cardCategoria: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  infoCategoria: {
    flex: 1,
  },
  idBadge: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 3,
  },
  nomeCategoria: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  acoesCategoria: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  btnEditar: {
    padding: 4,
  },
  botaoExcluir: {
    padding: 4,
  },
  overlayModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheetModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 24,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
  },
  labelCampo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  campoInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 17,
    color: "#1C1C1E",
    marginBottom: 24,
  },
  btnConfirmar: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  txtConfirmar: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  btnCancelarModal: {
    alignItems: "center",
    paddingVertical: 14,
  },
  txtCancelar: {
    fontSize: 17,
    color: "#8E8E93",
  },
});
