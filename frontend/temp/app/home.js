import { Text, View, Pressable } from "react-native";
import { router } from 'expo-router';
import { getAuth, signOut } from "firebase/auth";

export default function Home() {

  const onLogOutPressed = async(e) => {
    const auth = getAuth();
      signOut(auth).then(() => {
        console.log('Success logging out');
        router.navigate('/');
      }).catch((error) => {
        console.log('Error logging out', error);
      });
  }

  return (
    <View className='items-center'>
        <Text className=''>Home</Text>
        <Pressable
          onPress={onLogOutPressed}>
          <button>Log Out</button>
        </Pressable>
    </View>
  );
}
