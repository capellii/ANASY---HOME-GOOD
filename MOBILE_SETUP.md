# ANASY Mobile - Próximos Passos

## 📱 Instalação

```bash
cd mobile
npm install
```

## 🚀 Iniciar Desenvolvimento

```bash
npm start
```

Isso abrirá o Expo CLI. Você pode:
- Escanear o QR code com seu celular (Expo App)
- Pressionar `w` para abrir no navegador (web preview)
- Pressionar `a` para abrir no emulador Android
- Pressionar `i` para abrir no emulador iOS

## 🔧 Configuração da API

O arquivo `mobile/services/api.ts` já está configurado com:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});
```

**Importante**: Se testar em um celular físico ou emulador, ajuste para o IP real:
```typescript
baseURL: 'http://192.168.X.X:3000/api'
```

## 🔐 Atualizar Autenticação (Refresh Token)

### 1. AuthContext já existe

Arquivo: `mobile/context/AuthContext.tsx` (já implementado com AsyncStorage + header Authorization)

```typescript
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthContextType {
  isLoading: boolean;
  isSignIn: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignIn, setIsSignIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restaurar sessão ao iniciar app
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setIsSignIn(true);
        // Opcional: validar token com backend
      }
    } catch (e) {
      console.error('Failed to restore session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      // Armazenar tokens
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      // Configurar header padrão
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(user);
      setIsSignIn(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { name, email, password });
      // Auto-login após registro
      await signIn(email, password);
    } catch (error) {
      console.error('Sign up failed', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsSignIn(false);
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  const value = {
    isLoading,
    isSignIn,
    user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. AsyncStorage (já instalado)

```bash
npm install @react-native-async-storage/async-storage
```

### 3. App.tsx já usa AuthProvider

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createStackNavigator();

function RootNavigator() {
  const { isLoading, isSignIn } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignIn ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
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
```

### 4. LoginScreen já integrado

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('joao@teste.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <Button 
        title={loading ? 'Entrando...' : 'Entrar'} 
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
```

### 5. DashboardScreen já integrado

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardScreen() {
  const { signOut, user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await api.get('/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Failed to load devices', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Bem-vindo, {user?.name || 'Usuário'}!</Text>
      
      <Text style={styles.subtitle}>Dispositivos ({devices.length})</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.deviceCard}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text>{item.type} - {item.status}</Text>
            </View>
          )}
        />
      )}

      <Button title="Sair" onPress={handleLogout} color="#f00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  deviceCard: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  deviceName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
```

## 📋 Checklist de Integração

- [x] `npm install` no mobile/
- [x] AuthContext.tsx implementado
- [x] @react-native-async-storage/async-storage instalado
- [x] App.tsx com AuthProvider
- [x] LoginScreen integrado
- [x] DashboardScreen integrado
- [ ] Testar login local (backend rodando)
- [ ] Testar no emulador/celular
- [ ] Implementar refresh de token
- [ ] Adicionar mais funcionalidades

## 🧪 Teste Rápido

1. Inicie o backend:
```bash
docker compose up -d
```

2. Inicie o app:
```bash
cd mobile
npm start
# Pressione 'w' para web ou escaneie QR para celular
```

3. Tente fazer login com:
   - Email: `joao@teste.com`
   - Senha: `123456`

## ⚠️ Possíveis Erros

### "Cannot find module '@react-native-async-storage/async-storage'"
```bash
npm install @react-native-async-storage/async-storage
```

### "Network error: Failed to connect"
Verifique se o backend está rodando:
```bash
curl http://localhost:3000
```

### "CORS Error"
Backend não está com CORS habilitado. Solução:
```bash
npm install cors
```

E adicionar ao `src/app.ts`:
```typescript
import cors from 'cors';
app.use(cors());
```

## 📚 Referências

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Axios](https://axios-http.com)
- [React Navigation](https://reactnavigation.org)

---

**Tempo estimado**: 2-3 horas para implementação completa
