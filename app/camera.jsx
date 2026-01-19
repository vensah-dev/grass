import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

import natureReservesGeoData from '@/assets/geodata/natureReservesGeoData.json';
import { api } from "@/constants/API";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@react-navigation/elements";
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'; // If using Expo Router
import { React, useState } from 'react';

const genAI = new GoogleGenerativeAI(api.GeminiKey);


export default function CameraScreen() {
    const router = useRouter();
    const item = useLocalSearchParams()
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

    const [capture, setCapture] = useState(null);
    
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

    async function dosmt(name){
        for(let i = 0; i < natureReservesGeoData.features.length; i++){
            if (name == natureReservesGeoData.features[i].properties.NAME) {
                natureReservesGeoData.features[i].properties.CAPTURE = true
            }
        }
    }

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
                "Is there any natural greenery present in this picture? answer with only Yes or No.",
                {
                    inlineData: {
                        data: base64String,
                        mimeType: mimeTypeIn,
                    },
                },
            ]);
    
            console.log("result:", result.response.text());
            if (result.response.text().toLowerCase() == "yes"){
                setCapture(true)
            }else{
                setCapture(false)
            }
            console.log("capture", capture)
        } catch (error) {
    
            console.error("Error reading local image:", error);
        }
    }

    return (
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={["right", "left", "top"]} style={{ flex: 1, backgroundColor: colors.primary }}>

            <View className="flex-1 justify-center items-center">
                <Text className="mx-20 text-black75, text-center">
                    Ensure you are within a grass region (pink zone) {"\n\n"}
                    Take a picture of any greenery within the area
                </Text>
                <Button
                    onPress={() => {
                        takeAndAnalyzePhoto();
                        // router.push("/(info)");
                    }}
                    title="ASK"
                    color={colors.accentPrimary}
                    accessibilityLabel="Learn more about this purple button"
                    className="m-20"
                >
                    <Text className="m-20">Take Picture</Text>
                </Button>

                    {capture && (
                        <Link className="mx-20 text-green text-3xl text-center" href={{
                            pathname: "/(info)/ParkDetailView",
                            params: { name: item.name, name: item.capture, points: item.points }
                        }}
                        onPress={
                            () => {
                                dosmt(item.name);
                                // router.push("/(info)");
                            }
                        }
                        >
                            Captured!
                        </Link>
                    )}
                    {
                        capture == false && (
                            <Link className="mx-20 text-red text-3xl text-center" href={{
                                pathname: "/(info)/ParkDetailView",
                                params: { name: item.name, name: item.capture, points: item.points }
                            }}>
                                Capture Failed, Try again!
                            </Link>
                        )
                    }
            </View>

        </SafeAreaView >
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
