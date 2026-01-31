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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
}

export default function DashboardScreen() {
  const { state, signOut } = useAuth();
  const { user } = state;
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.deviceCard}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceType}>{item.type}</Text>
      <Text style={styles.deviceStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.welcome}>Bem-vindo, {user?.name || 'Usuário'}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
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
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={loadDevices}>
        <Text style={styles.refreshText}>Atualizar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  welcome: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
});
