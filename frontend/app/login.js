import { Text, View, TextInput } from "react-native";
//import { styled } from 'nativewind';
//const StyledText = styled(Text)
//import styles from './styles'

export default function Page() {
  return (
    <View className='items-center'>
      <Text className='text-xl'>Log Into Dwellow</Text>
      <Text className='font-semibold'>Email Address</Text>
      <TextInput placeholder="Enter Email"/>
      <Text className='font-semibold'>Password</Text>
      <TextInput
            secureTextEntry
            placeholder='Enter Password'
            className=''
          />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Login
      </button>
    </View>
  );
}