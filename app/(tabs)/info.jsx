import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import natureReservesGeoData from '@/assets/geodata/natureReservesGeoData.json';

const reserves = natureReservesGeoData.features;

const ParkItem = ({ item }) => (
    <View>
        <Link
            href={{
                pathname: "/(info)/ParkDetailView",
                params: { name: item.properties.NAME } // Turns object into a string
            }}
        >
            <Text>{item.properties.NAME}</Text>
        </Link>
    </View>
);

export default function TabTwoScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(reserves);

    const handleSearch = (text) => {
        setSearchQuery(text);

        // The Filter Logic
        const formattedQuery = text.toLowerCase();
        const filtered = reserves.filter(item => {
            // Check if the Reserve Name contains the search text
            const name = item.properties.NAME.toLowerCase();
            return name.includes(formattedQuery);
        });

        setFilteredData(filtered);
    };
    
    return (
        <SafeAreaView edges={["right", "left", "top"]} style={{ flex: 1, backgroundColor: colors.primary }}>
            <View>
                <TextInput
                    placeholder="Search Nature Reserves..."
                    clearButtonMode="always" // Adds an 'X' to clear on iOS
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={searchQuery}
                    onChangeText={(text) => handleSearch(text)}
                />

                <FlatList
                    data={filteredData.sort((a, b) => (a.properties.NAME < b.properties.NAME ? -1 : 1))}
                    renderItem={({ item }) => (
                        <ParkItem item={item} />
                    )}
                    keyExtractor={(item) => item.geometry.coordinates[0].toString()}
                    className="bg-primary"

                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                //   ListHeaderComponent={<HeaderWithProfile title={"Leaderboards"} />}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
});
