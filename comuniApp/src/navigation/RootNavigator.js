// src/navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../components';
import { colors, typography } from '../theme';

import SplashScreen from '../screens/SplashScreen';

import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import SelectGroupScreen from '../screens/groups/SelectGroupScreen';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import GroupRequestsScreen from '../screens/groups/GroupRequestsScreen';

import ExploreScreen from '../screens/events/ExploreScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import EventRequestsScreen from '../screens/events/EventRequestsScreen';
import EventAttendanceRequestsScreen from '../screens/events/EventAttendanceRequestsScreen';

import NotificationsScreen from '../screens/notifications/NotificationsScreen';

import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const stackScreenOptions = {
    headerTintColor: colors.primary,
    headerTitleStyle: { ...typography.heading, color: colors.textPrimary },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: colors.background },
};

const tabIcon = (name) => ({ color, size, focused }) => (
    <Icon name={focused ? name : `${name}-outline`} size={size} color={color} />
);

function MainTabs({ route }) {
    const { groupId, groupName } = route.params || {};
    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
                tabBarStyle: { borderTopColor: colors.border, backgroundColor: colors.surface },
            }}
        >
            <Tabs.Screen
                name="Explore"
                component={ExploreScreen}
                initialParams={{ groupId, groupName }}
                options={{ title: 'Explorar', tabBarIcon: tabIcon('compass') }}
            />
            <Tabs.Screen
                name="NotificationsTab"
                component={NotificationsScreen}
                options={{ title: 'Notificaciones', tabBarIcon: tabIcon('notifications') }}
            />
            <Tabs.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil', tabBarIcon: tabIcon('person') }}
            />
        </Tabs.Navigator>
    );
}

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={stackScreenOptions}>
            {/* Auth */}
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: '' }} />
            <Stack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ title: '' }} />

            {/* App */}
            <Stack.Screen name="SelectGroup" component={SelectGroupScreen} options={{ title: 'Tus grupos' }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

            {/* Eventos */}
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Nuevo evento' }} />
            <Stack.Screen name="EventRequests" component={EventRequestsScreen} options={{ title: 'Eventos por aprobar' }} />
            <Stack.Screen name="EventAttendanceRequests" component={EventAttendanceRequestsScreen} options={{ headerShown: false }} />

            {/* Grupos */}
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Nuevo grupo' }} />
            <Stack.Screen name="GroupRequests" component={GroupRequestsScreen} options={{ title: 'Solicitudes del grupo' }} />

            {/* Notificaciones / Perfil */}
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil' }} />
        </Stack.Navigator>
    );
}
