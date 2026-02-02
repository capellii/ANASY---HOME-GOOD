import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ScenariosScreen from './screens/ScenariosScreen';
import EnergyScreen from './screens/EnergyScreen';
import SecurityScreen from './screens/SecurityScreen';
import HealthScreen from './screens/HealthScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Devices"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Devices',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
          headerTitle: 'My Devices',
        }}
      />
      <Tab.Screen
        name="Scenarios"
        component={ScenariosScreen}
        options={{
          tabBarLabel: 'Scenarios',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚡</Text>,
          headerTitle: 'Automation',
        }}
      />
      <Tab.Screen
        name="Energy"
        component={EnergyScreen}
        options={{
          tabBarLabel: 'Energy',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔋</Text>,
          headerTitle: 'Energy Monitor',
        }}
      />
      <Tab.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          tabBarLabel: 'Security',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔒</Text>,
          headerTitle: 'Security',
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❤️</Text>,
          headerTitle: 'Health',
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { state } = useAuth();
  const { isLoading, isSignIn } = state;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isSignIn ? (
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
