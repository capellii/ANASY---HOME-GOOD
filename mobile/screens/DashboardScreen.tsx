import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface Device {
  id: number;
  name: string;
  type: string;
  status: any;
}

const getPowerValue = (status: any) => {
  if (!status) return 'off';
  if (typeof status === 'string') return status;
  if (typeof status?.power === 'boolean') return status.power ? 'on' : 'off';
  if (typeof status?.power === 'string') return status.power;
  return 'off';
};

const buildNextStatus = (status: any) => {
  const current = getPowerValue(status);
  const next = current === 'on' ? 'off' : 'on';
  const base = typeof status === 'object' && status !== null ? status : {};
  return { ...base, power: next };
};

export default function DashboardScreen() {
  const { state, signOut } = useAuth();
  const { user } = state;
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'light' as const,
    protocol: 'wifi' as const,
    status: { power: 'off' },
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/devices');
      setDevices(response.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar dispositivos:', error);
      Alert.alert('Erro', 'Falha ao carregar dispositivos.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer logout.');
    }
  };

  const handleToggleDevice = async (device: Device) => {
    try {
      const nextStatus = buildNextStatus(device.status);
      const response = await api.patch(`/devices/${device.id}/status`, { status: nextStatus });
      const updated = response.data;
      setDevices((prev) => prev.map((item) => (item.id === device.id ? updated : item)));
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar dispositivo.');
    }
  };

  const handleCreateDevice = async () => {
    if (!newDevice.name.trim()) {
      Alert.alert('Erro', 'Nome do dispositivo é obrigatório.');
      return;
    }

    setCreateLoading(true);
    try {
      const response = await api.post('/devices', {
        name: newDevice.name,
        type: newDevice.type,
        protocol: newDevice.protocol,
        status: newDevice.status,
      });
      setDevices((prev) => [...prev, response.data]);
      setShowCreateModal(false);
      setNewDevice({
        name: '',
        type: 'light',
        protocol: 'wifi',
        status: { power: 'off' },
      });
      Alert.alert('Sucesso', 'Dispositivo criado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar dispositivo.');
    } finally {
      setCreateLoading(false);
    }
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const power = getPowerValue(item.status);
    return (
    <View style={styles.deviceCard}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceType}>{item.type}</Text>
      <Text style={styles.deviceStatus}>Status: {power}</Text>
      <TouchableOpacity
        style={[styles.toggleButton, power === 'on' ? styles.toggleOn : styles.toggleOff]}
        onPress={() => handleToggleDevice(item)}
      >
        <Text style={styles.toggleText}>{power === 'on' ? 'Desligar' : 'Ligar'}</Text>
      </TouchableOpacity>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Text style={styles.welcome}>Welcome, {user?.name || 'User'}!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dispositivos</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#1e40af" style={styles.loader} />
            ) : devices.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum dispositivo registrado.</Text>
            ) : (
              <FlatList
                data={devices}
                renderItem={renderDevice}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
              />
            )}
          </View>

          <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
            <Text style={styles.createButtonText}>+ Novo Dispositivo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.refreshButton} onPress={loadDevices}>
            <Text style={styles.refreshText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Dispositivo</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalLabel}>Nome do Dispositivo</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Luz Sala"
              value={newDevice.name}
              onChangeText={(text) => setNewDevice((prev) => ({ ...prev, name: text }))}
              editable={!createLoading}
            />

            <Text style={styles.modalLabel}>Tipo</Text>
            <View style={styles.typeContainer}>
              {(['light', 'plug', 'ac', 'lock'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newDevice.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewDevice((prev) => ({ ...prev, type: type as any }))}
                  disabled={createLoading}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newDevice.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Protocolo</Text>
            <View style={styles.protocolContainer}>
              {(['wifi', 'zigbee', 'zwave'] as const).map((protocol) => (
                <TouchableOpacity
                  key={protocol}
                  style={[
                    styles.protocolButton,
                    newDevice.protocol === protocol && styles.protocolButtonActive,
                  ]}
                  onPress={() => setNewDevice((prev) => ({ ...prev, protocol: protocol as any }))}
                  disabled={createLoading}
                >
                  <Text
                    style={[
                      styles.protocolButtonText,
                      newDevice.protocol === protocol && styles.protocolButtonTextActive,
                    ]}
                  >
                    {protocol}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalCreateButton, createLoading && styles.modalCreateButtonDisabled]}
              onPress={handleCreateDevice}
              disabled={createLoading}
            >
              {createLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalCreateButtonText}>Criar Dispositivo</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    ...(Platform.OS === 'web' ? { paddingHorizontal: 16 } : null),
  },
  scrollContent: {
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcome: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deviceStatus: {
    fontSize: 12,
    color: '#1e40af',
    marginTop: 8,
  },
  toggleButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: '#ef4444',
  },
  toggleOff: {
    backgroundColor: '#22c55e',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 16,
  },
  loader: {
    marginVertical: 32,
  },
  refreshButton: {
    backgroundColor: '#1e40af',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseText: {
    color: '#1e40af',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    borderColor: '#1e40af',
    backgroundColor: '#e0e7ff',
  },
  typeButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#1e40af',
  },
  protocolContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  protocolButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  protocolButtonActive: {
    borderColor: '#1e40af',
    backgroundColor: '#e0e7ff',
  },
  protocolButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  protocolButtonTextActive: {
    color: '#1e40af',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  modalCreateButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCreateButtonDisabled: {
    opacity: 0.6,
  },
  modalCreateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
