import { colors } from "@/constants/colors";
import { Tabs } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
 
import Ionicons from '@expo/vector-icons/Ionicons';

import "../../global.css";

const IconSize = 28;

export default function TabsScreen() {
    return (
        <>
            <StatusBar style="auto" />

            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: colors.accentPrimary,
                    tabBarInactiveTintColor: colors.black50,
                    
                    tabBarStyle: {
                        backgroundColor: colors.primary,
                        borderTopWidth: 1,
                        borderTopColor: colors.secondary,
                        // paddingVertical: 4,
                        // minHeight: 83,

                    },

                }}
            >

                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Map",
                        headerShown: false,
                        tabBarIcon: function({ color }) {
                            return <Ionicons name="map" size={24} color={color} />;
                        },
                    }}
                />

                {/* <Tabs.Screen
                    name="camera"
                    options={{
                        title: "Camera",
                        headerShown: false,
                        tabBarIcon: function({ color }) {
                            return <Ionicons name="camera" size={28} color={color} />;
                        },                    
                    }}
                /> */}

                <Tabs.Screen
                    name="info"
                    options={{
                        title: "Info",
                        headerShown: false,
                        tabBarIcon: function({ color }) {
                            return <Ionicons name="information-circle" size={28} color={color} />;
                        },                    
                    }}
                />

            </Tabs>
        </>
    )
}