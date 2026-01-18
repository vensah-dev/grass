import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from "../../constants";
import { colors } from "../../constants/colors";

import "../../global.css";

const TabIcon = ({ icon, name, color, focused }) => {
    return (
        <View className="items-center justify-center mt-8">
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-8 h-8"
            />

            <Text style={{ color: color }} className="text-xs">
                {name}
            </Text>
        </View>
    )
}

export default function TabsScreen() {

    return (
        <>
            <StatusBar style="auto" />

            <SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1, backgroundColor: colors.primary }} >
                <Tabs
                    screenOptions={{
                        tabBarShowLabel: false,
                        tabBarActiveTintColor: colors.accentPrimary,
                        tabBarInactiveTintColor: colors.white100,
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
                            title: "Home",
                            headerShown: false,
                            tabBarIcon: ({ color, focused }) => (
                                <TabIcon
                                    icon={icons.home}
                                    color={color}
                                    focused={focused}
                                />
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="explore"
                        options={{
                            title: "Explore",
                            headerShown: false,
                            tabBarIcon: ({ color, focused }) => (
                                <TabIcon
                                    icon={icons.lightBulb}
                                    color={color}
                                    focused={focused}
                                />
                            ),
                        }}
                    />

                </Tabs>
            </SafeAreaView>
        </>
    )
}