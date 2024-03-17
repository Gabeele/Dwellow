import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View className='items-center'>
        <Text>Temp Page - Navigation</Text>
        <Text><Link href="/login">Login</Link></Text>
    </View>
  );
}
