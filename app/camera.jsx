import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@react-navigation/elements";
import { File } from 'expo-file-system';

import * as ImagePicker from 'expo-image-picker';

const genAI = new GoogleGenerativeAI("AIzaSyDQkEshsuggodFlz9cHo7DkYY-InaQjypQ");


const takeAndAnalyzePhoto = async () => {
    // 1. Ask for permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('We need camera access to identify plants!');
        return;
    }

    // 2. Launch the camera
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true, // Let the user crop to just the plant
        quality: 0.2,        // 0.2 = Small file (good for bad signal), 1.0 = Massive
        base64: false,       // We will convert it manually for better control
    });

    if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        console.log("📸 Photo captured to:", imageUri);

        console.log(result)
        console.log(result.assets[0].mimeType)


        // 3. Process for Gemini
        await analyzeLocalImage(imageUri, result.assets[0].mimeType);
    }
};

async function analyzeLocalImage(uri, mimeTypeIn) {
    try {
        // 1. Resolve the path (especially if using aliases like @/)
        // If it's a static asset, you usually use require()
        // const imageAsset = Asset.fromModule(require('@/assets/images/plant2.jpeg'));
        // await imageAsset.downloadAsync(); // Ensure it's available locally

        const myFile = new File(uri);

        const base64String = await myFile.base64();

        // console.log("function run")

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent([
            "What kind of plant is this?",
            {
                inlineData: {
                    data: base64String,
                    mimeType: mimeTypeIn,
                },
            },
        ]);

        console.log("result:", result.response.text());
    } catch (error) {

        console.error("Error reading local image:", error);
    }
}

export default function CameraScreen() {
    // useEffect(() => {
    //     (async () => {
    //         // 1. Ask for permission
    //         const { status } = await ImagePicker.requestCameraPermissionsAsync();
    //         if (status !== 'granted') {
    //             alert('We need camera access to identify plants!');
    //             return;
    //         }

    //         // 2. Launch the camera
    //         const result = await ImagePicker.launchCameraAsync({
    //             mediaTypes: ['images'],
    //             allowsEditing: true, // Let the user crop to just the plant
    //             quality: 0.2,        // 0.2 = Small file (good for bad signal), 1.0 = Massive
    //             base64: false,       // We will convert it manually for better control
    //         });

    //         if (!result.canceled) {
    //             const imageUri = result.assets[0].uri;
    //             console.log("📸 Photo captured to:", imageUri);

    //             console.log(result)
    //             console.log(result.assets[0].mimeType)


    //             // 3. Process for Gemini
    //             await analyzeLocalImage(imageUri, result.assets[0].mimeType);
    //         }
    //     })();
    // }, []);

    return (
        <SafeAreaView edges={["right", "left", "top"]} style={{ flex: 1, backgroundColor: colors.primary }}>
            <View className="flex-1 justify-center items-center">
                <Text className="mx-20 text-black75, text-center">
                    Ensure you are within a grass patch {"\n\n"}
                    Take a picture of any greenery within the area
                </Text>
                <Button
                    onPress={() => takeAndAnalyzePhoto()}
                    title="ASK"
                    color={colors.accentPrimary}
                    accessibilityLabel="Learn more about this purple button"
                    className="m-20"
                >
                    <Text className="m-20">Take Picture</Text>
                </Button>
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
