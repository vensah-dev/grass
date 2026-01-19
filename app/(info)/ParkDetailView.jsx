import { StyleSheet, Text, View } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function ParkDetailView() {
    const router = useRouter();
    const item = useLocalSearchParams()
  return (
    <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center bg-secondary text-black90 gap-10">
            <Text>Name: {item.name}</Text>
            {item.capture == true ? (
                <Text className=" text-green text-3xl">Captured</Text>
            ):(
                <Text className="text-red text-3xl">Not Caputred</Text>
            )
            }
            <Text>Points: {Math.round(item.points)}</Text>

        </View>
    </>
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
