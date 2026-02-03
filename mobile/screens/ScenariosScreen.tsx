import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import api from '../services/api';

interface Scenario {
  id: number;
  name: string;
  description?: string;
  enabled: boolean;
  trigger?: any;
  actions?: any;
}

export default function ScenariosScreen() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const response = await api.get('/scenarios');
      setScenarios(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const createScenario = async () => {
    if (!newScenario.name.trim()) {
      Alert.alert('Error', 'Scenario name is required');
      return;
    }

    try {
      const response = await api.post('/scenarios', {
        name: newScenario.name,
        description: newScenario.description,
        trigger: {},
        actions: {},
        enabled: true,
      });
      setScenarios([...scenarios, response.data]);
      setModalVisible(false);
      setNewScenario({ name: '', description: '' });
      Alert.alert('Success', 'Scenario created successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create scenario');
    }
  };

  const renderScenario = ({ item }: { item: Scenario }) => (
    <View style={styles.scenarioCard}>
      <View style={styles.scenarioHeader}>
        <Text style={styles.scenarioName}>{item.name}</Text>
        <View style={[styles.statusBadge, item.enabled ? styles.active : styles.inactive]}>
          <Text style={styles.statusText}>{item.enabled ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.scenarioDescription}>{item.description}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Automation Scenarios</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {scenarios.length === 0 ? (
          <Text style={styles.emptyText}>No scenarios yet. Create your first one!</Text>
        ) : (
          scenarios.map((item) => (
            <View key={item.id}>
              {renderScenario({ item })}
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Scenario</Text>

            <TextInput
              style={styles.input}
              placeholder="Scenario Name"
              value={newScenario.name}
              onChangeText={(text) => setNewScenario({ ...newScenario, name: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newScenario.description}
              onChangeText={(text) => setNewScenario({ ...newScenario, description: text })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={createScenario}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    ...(Platform.OS === 'web' ? { paddingHorizontal: 16 } : null),
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  scenarioCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: '#4CAF50',
  },
  inactive: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
