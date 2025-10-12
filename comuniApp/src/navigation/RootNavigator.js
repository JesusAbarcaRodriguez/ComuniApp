import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SelectGroupScreen from '../screens/SelectGroupScreen';

import ExploreScreen from '../screens/ExploreScreen';
import EventsScreen from '../screens/EventsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';

import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupRequestsScreen from '../screens/GroupRequestsScreen';
import EventRequestsScreen from '../screens/EventRequestsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';


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
                    tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="Events"
                component={EventsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="NotificationsTab"
                component={NotificationsScreen}
                initialParams={{ variant: 'list' }}
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
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
            <Stack.Screen name="SelectGroup" component={SelectGroupScreen} options={{ title: 'Select Group' }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ title: 'Event Details' }}
            />
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notification' }}
            />
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
            <Stack.Screen name="GroupRequests" component={GroupRequestsScreen} options={{ title: 'Group Requests' }} />
            <Stack.Screen name="EventRequests" component={EventRequestsScreen} options={{ title: 'Event Requests' }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create Event' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
        </Stack.Navigator>
    );
}
