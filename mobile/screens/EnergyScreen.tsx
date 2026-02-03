import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import api from '../services/api';

interface EnergyRecord {
  id: number;
  device_id: number;
  power_watts: number;
  timestamp: string;
}

export default function EnergyScreen() {
  const [energyData, setEnergyData] = useState<EnergyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalConsumption, setTotalConsumption] = useState(0);

  useEffect(() => {
    loadEnergyData();
  }, []);

  const loadEnergyData = async () => {
    try {
      // Get all devices first
      const devicesResponse = await api.get('/devices');
      const devices = devicesResponse.data;

      // Fetch energy data for all devices
      const energyPromises = devices.map((device: any) =>
        api.get(`/energy/device/${device.id}`).catch(() => ({ data: [] }))
      );
      const energyResponses = await Promise.all(energyPromises);
      
      const allEnergyData = energyResponses.flatMap((res) => res.data);
      setEnergyData(allEnergyData);

      // Calculate total consumption
      const total = allEnergyData.reduce((sum, record) => sum + (record.power_watts || 0), 0);
      setTotalConsumption(total / 1000); // Convert to kWh
    } catch (error) {
      console.error('Failed to load energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderEnergyRecord = ({ item }: { item: EnergyRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.deviceText}>Device #{item.device_id}</Text>
        <Text style={styles.powerText}>{(item.power_watts / 1000).toFixed(2)} kWh</Text>
      </View>
      <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Energy Monitor</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Consumption</Text>
          <Text style={styles.summaryValue}>{totalConsumption.toFixed(2)} kWh</Text>
          <Text style={styles.summarySubtext}>{energyData.length} records</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {energyData.length === 0 ? (
          <Text style={styles.emptyText}>No energy data available yet.</Text>
        ) : (
          energyData.map((item, index) => (
            <View key={`${item.id}-${index}`}>
              {renderEnergyRecord({ item })}
            </View>
          ))
        )}
      </ScrollView>
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
  summaryCard: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceText: {
    fontSize: 16,
    color: '#666',
  },
  powerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
