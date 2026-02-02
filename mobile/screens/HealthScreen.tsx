import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface HealthMetric {
  id: number;
  metric_type: string;
  value: number;
  timestamp: string;
}

export default function HealthScreen() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();

  useEffect(() => {
    loadHealthMetrics();
  }, []);

  const loadHealthMetrics = async () => {
    try {
      const userId = state.user?.id;
      if (!userId) return;

      const response = await api.get(`/health/user/${userId}`);
      setMetrics(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load health metrics');
    } finally {
      setLoading(false);
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'heart_rate':
        return '❤️';
      case 'temperature':
        return '🌡️';
      case 'steps':
        return '👟';
      case 'sleep':
        return '😴';
      default:
        return '📊';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderMetric = ({ item }: { item: HealthMetric }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricIcon}>{getMetricIcon(item.metric_type)}</Text>
        <View style={styles.metricInfo}>
          <Text style={styles.metricType}>{item.metric_type.replace('_', ' ')}</Text>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
        <Text style={styles.metricValue}>{item.value}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const averageValue = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length).toFixed(1)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Metrics</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Average Value</Text>
        <Text style={styles.summaryValue}>{averageValue}</Text>
        <Text style={styles.summarySubtext}>{metrics.length} readings</Text>
      </View>

      <Text style={styles.sectionTitle}>Recent Metrics</Text>

      <FlatList
        data={metrics}
        renderItem={renderMetric}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No health metrics recorded yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#2196F3',
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
  metricCard: {
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  metricInfo: {
    flex: 1,
  },
  metricType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
