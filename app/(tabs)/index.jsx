import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';

export default function HomeScreen() {
    var listOfMarkers = [
        {
            title: "Pier 39",
            description: "Loud sea lions here!",
            coords: {
                latitude: 37.8082,
                longitude: -122.4095,
            }
        },
        {
            title: "Golden Gate Bridge",
            description: "Iconic suspension bridge.",
            coords: {
                latitude: 37.8199,
                longitude: -122.4783,
            }
        },
        {
            title: "Gardens by the Bay",
            description: "contains grass.",
            coords: {
                latitude: 1.2816,
                longitude: 103.8636,
            }
        },
    ]

    const regionCoordinates = [
        { latitude: 37.78825, longitude: -122.4324 },
        { latitude: 37.78925, longitude: -122.4344 },
        { latitude: 37.78625, longitude: -122.4354 },
        { latitude: 37.78425, longitude: -122.4304 },
    ];

    return (
        <View className='flex-1 items-center justify-center'>
            <MapView
                className='flex-1'
                style={{ ...StyleSheet.absoluteFillObject }}
                initialRegion={{
                    latitude: 1.3521,
                    longitude: 103.8198,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }}
            >
                {listOfMarkers.map((marker, index) => (
                    <Marker
                        coordinate={marker.coords}
                        title={marker.title}
                        description={marker.description}
                        key={index}
                    />
                ))}

                <Polygon
                    coordinates={regionCoordinates}
                    strokeColor="#FF0000" // Outline color
                    fillColor="rgba(255, 0, 0, 0.5)" // Shape color with opacity
                    strokeWidth={2} // Outline width
                />


                {/* Marker 2: Pier 39
                <Marker
                    coordinate={pier39Coords}
                    title="Pier 39"
                    description="Loud sea lions here!"
                    pinColor="blue" // You can change the pin color
                /> */}

            </MapView>
        </View>
    );
}
