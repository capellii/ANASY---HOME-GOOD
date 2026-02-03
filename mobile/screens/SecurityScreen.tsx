import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SecurityEvent {
  id: number;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  created_at: string;
}

export default function SecurityScreen() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();
  const userId = state.user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadSecurityEvents(userId);
  }, [userId]);

  const loadSecurityEvents = async (id: string | number) => {
    try {
      const response = await api.get(`/security/user/${id}`);
      setEvents(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load security events');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#F44336';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderEvent = ({ item }: { item: SecurityEvent }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(item.created_at)}</Text>
      </View>
      <Text style={styles.eventType}>{item.event_type}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F44336" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Security Events</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{events.length}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#F44336' }]}>
              {events.filter((e) => e.severity === 'critical' || e.severity === 'high').length}
            </Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
        </View>

        {events.length === 0 ? (
          <Text style={styles.emptyText}>No security events. All systems secure!</Text>
        ) : (
          events.map((item) => (
            <View key={item.id.toString()}>
              {renderEvent({ item })}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  eventType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
