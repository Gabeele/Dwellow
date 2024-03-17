import { Text, View, TextInput, Button } from "react-native";
import { Link, router } from 'expo-router';
import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState({ value: ''})
  const [password, setPassword] = useState({ value: ''})

  const onLoginPressed = () => {
    // fix this to use with firebase
    // validation
    // enter form
    fetch('https://dwellow.ca/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
      <Button 
        title="Login"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onPress={() => {
          //onLoginPressed
          //temp nav for now
          router.navigate('/home');
        }}>
      </Button>
    </View>
  );
}