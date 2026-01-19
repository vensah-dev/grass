import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import * as turf from '@turf/turf';
import * as Crypto from 'expo-crypto';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router'; // If using Expo Router
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import MapView, { Callout, Geojson, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { colors } from '@/constants/colors';
import natureReservesGeoData from '../../assets/geodata/natureReservesGeoData.json';

const darkMapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b9d3c2"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
]

const initialState = {
    name: null,       // The name to display in the callout
    coordinate: null, // {latitude: number, longitude: number} for the marker position
};

export default function HomeScreen() {
    const router = useRouter();
    
    const [selectedFeature, setSelectedFeature] = useState(initialState);
    const [locationPerms, setLocationPerms] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [insideof, setInsideOf] = useState(null);

    useEffect(() => {
        let subscription;

        const startTracking = async () => {
            // 2. Ask for permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            // 3. Start watching. 'pos' is the data coming from the GPS.
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5, // Update every 5 meters to save battery
                },
                (pos) => {
                    // 4. We "push" the GPS data into our userLocation state
                    setUserLocation(pos);
                }
            );
        };

        startTracking();

        // Cleanup: Stop the GPS when the user leaves this screen
        return () => { if (subscription) subscription.remove(); };
    }, []);

    useEffect(() => {
        if (userLocation) {
            const userPt = turf.point([
                userLocation.coords.longitude, 
                userLocation.coords.latitude
            ]);

            const parkFeatures = natureReservesGeoData.features
            for(let i = 0; i < parkFeatures.length; i++){
                const inside = booleanPointInPolygon(userPt, parkFeatures[i]);
                if(inside){console.log( "inside of ", parkFeatures[i].properties.NAME)};

                if (inside){
                    setInsideOf(parkFeatures[i].properties.NAME);
                }else{
                    setInsideOf(null);
                }
                console.log(insideof)
                break


                // if (inside) {
                //     alert(`Welcome to ${parkFeatures[i].properties.NAME}`);
                // }
            }
        }
    }, [userLocation]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            setLocationPerms(status.toString());


            if (status !== 'granted') {
                setLocationPerms(false);
                return;
            }else{
                setLocationPerms(true);
            }

            console.log(locationPerms)

        })();
    }, []);

    const handlePolygonPress = (event) => {
        // console.log(event.feature.properties.NAME)
        var reserveName = event.feature.properties.NAME;
        const geometry = event.feature.geometry;
        var properties = event.feature.properties;


        console.log('Pressed Reserve Name:', reserveName);

        const center = turf.pointOnFeature(geometry);
        console.log("brrr", center.geometry.coordinates)

        setSelectedFeature({
            name: reserveName,
            coordinate: {
                latitude: center.geometry.coordinates[1],
                longitude: center.geometry.coordinates[0],
            },
            properties: properties
        });
    };

    return (
        <View className='flex-1 items-center justify-center'>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                customMapStyle={useColorScheme() === 'dark' ? darkMapStyle : []}
                showsUserLocation={true}      // Shows the blue dot
                followsUserLocation={false}    // Set to true if you want the map to follow the user
                showsMyLocationButton={true}
                initialRegion={{
                    latitude: 1.3521,
                    longitude: 103.8198,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }}
            >
                <Geojson
                    geojson={natureReservesGeoData}
                    strokeColor={colors.accentPrimary}
                    fillColor="rgba(255, 178, 249, 0.5)"
                    strokeWidth={2}
                    tappable={true}
                    onPress={handlePolygonPress}
                />

                {selectedFeature.coordinate && (
                    <Marker
                        key={Crypto.randomUUID().toString()}
                        coordinate={selectedFeature.coordinate}
                        title={selectedFeature.name}
                        pinColor={colors.accentPrimary}
                    >
                        <Callout onPress={() => router.push({
                            pathname: '../camera',
                            params: {
                                name: selectedFeature.name,  
                                capture: selectedFeature.properties.CAPTURE, 
                                points: selectedFeature.properties["SHAPE_1.AREA"]
                            }
                            })}
                        >
                            <View style={{ padding: 10, minWidth: 100 }}>
                                <Text style={{ fontWeight: 'bold' }}>{selectedFeature.name}</Text>
                                {console.log(insideof == selectedFeature.name)}
                                <Text>{insideof == selectedFeature.name ? "You are currently inside" : "You have not been here yet!"}</Text>
                                <Text style={{ color: 'blue', marginTop: 5 }}>View More →</Text>
                            </View>
                        </Callout>
                    </Marker>
                )}
            </MapView>
        </View>
    );
}
