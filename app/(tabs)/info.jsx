import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import { React, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import natureReservesGeoData from '@/assets/geodata/natureReservesGeoData.json';

const reserves = natureReservesGeoData.features;

const ParkItem = ({ item, index }) => (
    <View>
        <Link
            href={{
                pathname: "/(info)/ParkDetailView",
                params: { name: item.properties.NAME,  capture: item.properties.CAPTURE, points: item.properties["SHAPE_1.AREA"]} 
            }}
        >
            <View className={`${index%2==0 ? "bg-tertiary":"bg-secondary"} text-black w-full flex-row justify-evenly`}>
                <Text className="m-10">{item.properties.NAME}</Text>
                {/* <Text className="m-10">⮕</Text> */}

            </View>
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

        setFilteredData(filtered.sort((a, b) => (a.properties.NAME < b.properties.NAME ? -1 : 1)));
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
                    className="bg-secondary p-10 text-black75"
                />

                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => (
                        <ParkItem item={item} index={filteredData.findIndex((temp) => temp.properties.NAME === item.properties.NAME)} />
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
