export default {
  expo: {
    name: "Laika",
    slug: "laika-proyecto-modular",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/PerroIcon.png",
    userInterfaceStyle: "light",
    backgroundColor: "#ffffff",
    splash: {
      image: "./assets/inicio.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      package: "com.laika.proyectomodular",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/PerroIcon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.laika.proyectomodular",
      icon: "./assets/PerroIcon.png",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      API_URL: "https://monitor-loyal-openly.ngrok-free.app",
      eas: {
        projectId: "78bec484-c506-4d3e-ae97-b2cbeef77296"
      }
    },
    plugins: [
      "expo-secure-store",
			"expo-notifications",
      "expo-asset",
      "expo-font",
      [
        "react-native-maps",
        {
          iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
          androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      ]
    ],
    owner: "daviduziel2345"
  }
};
