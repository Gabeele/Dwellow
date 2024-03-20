import { Text, View, TextInput,Pressable } from "react-native";
import { router } from 'expo-router';
import React, { useState } from 'react'
import { app } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLoginPressed = async(e) => {
    // user validation with firebase
    // firebase will get back token id
    // fetch to our database
    const auth = getAuth(app);
    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        fetch('https://api.dwellow.ca/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            token: token,
            email: email
            }),
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            console.log('Success logging in');
            router.navigate('/home');
          })
          .catch(error => {
            console.error('Error logging into database:', error);
          });
      }
      catch(error){
        console.error('Error authenticating with firebase:', error);
      };
  }

  const onCreateAccountPressed = async(e) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  }
  
  // page view
  return (
    <View className='items-center'>
      <Text className='text-xl'>Log Into Dwellow</Text>
      <Text className='font-semibold'>Email Address</Text>
      <TextInput 
        value={email}
        onChangeText={text => setEmail(text)}
        autoCompleteType="email"
        textContentType="emailAddress"
        className='text-opacity-50 border'
        placeholder="Enter Email"
        />
      <Text className='font-semibold'>Password</Text>
      <TextInput 
        value={password}
        onChangeText={text => setPassword(text)} 
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