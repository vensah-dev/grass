import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParkDetailView() {
    const router = useRouter();
    const item = useLocalSearchParams()
  return (
    <SafeAreaView edges={["right", "left", "top"]} style={{ flex: 1, backgroundColor: colors.primary }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View>
            <Text>{item.name}</Text>
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
