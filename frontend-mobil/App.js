import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
    const [fontsLoaded] = useFonts({
        Nunito: require("./assets/Nunito-VariableFont_wght.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return <AppNavigator />;
}