import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
        <Text>Temp Page - Navigation</Text>
        <Text><Link href="/login">Login</Link></Text>
    </View>
  );
}
