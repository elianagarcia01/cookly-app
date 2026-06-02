import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import SplashScreen from '../screens/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  RecipeDetail: { idMeal: string; strMeal?: string };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E07B39',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#1a1a1a', borderTopWidth: 0 },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Buscar', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔍</Text> }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Favoritos', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>❤️</Text> }}
      />
    </Tab.Navigator>
  );
}

const linking = {
  prefixes: ['cookly://'],
  config: {
    screens: {
      MainTabs: '',
      RecipeDetail: 'recipe/:idMeal',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
