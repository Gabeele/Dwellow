import { Text, View, TextInput, Button, Pressable } from "react-native";
import { router } from 'expo-router';
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';

export default function Login() {
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState({ value: ''})
  const [password, setPassword] = useState({ value: ''})

  const onLoginPressed = () => {
    // fix this to use with firebase
    // validation
    // enter form
    fetch('https://api.dwellow.ca/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ''
      },
      body: JSON.stringify({
        token: '',
        email: ''
        }),
    })
      .then(response => response.json())
      .then(data => {
        router.navigate('/home');
        //router.navigate('home', { user: data.user, user_id: data.user.data.user_id });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <View className='items-center'>
      <Text className='text-xl'>Log Into Dwellow</Text>
      <Text className='font-semibold'>Email Address</Text>
      <TextInput 
        value={email.value}
        onChangeText={(text) => setEmail({ value: text})}
        autoCompleteType="email"
        textContentType="emailAddress"
        className='text-opacity-50 border'
        placeholder="Enter Email"
        />
      <Text className='font-semibold'>Password</Text>
      <TextInput 
        value={password.value}
        onChangeText={(text) => setPassword({ value: text})} 
        secureTextEntry 
        placeholder='Enter Password'
        className=''
      />
      <Pressable 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onPress={onLoginPressed}>
          <button>Login</button>
      </Pressable>

    </View>
  );
}