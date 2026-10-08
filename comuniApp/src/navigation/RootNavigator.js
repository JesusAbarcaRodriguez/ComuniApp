import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import SelectGroupScreen from '../screens/groups/SelectGroupScreen';

import ExploreScreen from '../screens/events/ExploreScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';

import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import GroupRequestsScreen from '../screens/groups/GroupRequestsScreen';
import EventRequestsScreen from '../screens/events/EventRequestsScreen';
import EventAttendanceRequestsScreen from '../screens/events/EventAttendanceRequestsScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';

import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs({ route }) {
    const { groupId, groupName } = route.params || {};
    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#4F59F5',
            }}
        >
            <Tabs.Screen
                name="Explore"
                component={ExploreScreen}
                initialParams={{ groupId, groupName }}
                options={{
                    title: 'Explorar',
                    tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="NotificationsTab"
                component={NotificationsScreen}
                initialParams={{ variant: 'list' }}
                options={{
                    title: 'Notificaciones',
                    tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" size={size} color={color} />,
                }}
            />
        </Tabs.Navigator>
    );
}


export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Crear cuenta' }} />
            <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ title: 'Recuperar contraseña' }} />
            <Stack.Screen name="SelectGroup" component={SelectGroupScreen} options={{ title: 'Seleccionar Grupo' }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notificaciones' }}
            />
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Crear Grupo' }} />
            <Stack.Screen name="GroupRequests" component={GroupRequestsScreen} options={{ title: 'Solicitudes de Grupo' }} />
            <Stack.Screen name="EventRequests" component={EventRequestsScreen} options={{ title: 'Solicitudes de Eventos' }} />
            <Stack.Screen name="EventAttendanceRequests" component={EventAttendanceRequestsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Crear Evento' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
        </Stack.Navigator>
    );
}
