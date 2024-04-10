import { Text, View, TextInput,Pressable, Picker } from "react-native";
import { router, Link } from 'expo-router';
import React, { useState } from 'react'
import { app } from "../firebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userType, setUserType] = useState('')
    const [inviteCode, setInviteCode] = useState('')

    const onRegisterPressed = async(e) => {
      let fullName = firstName.concat(" " + lastName);
      
      const auth = getAuth(app);
      try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const token = await user.getIdToken();
          
          fetch('https://api.dwellow.ca/account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              token: token,
              email: email,
              userType: userType,
              fullName: fullName,
              phoneNumber: phoneNumber
              }),
          })
            .then(response => 
              {
                if( response.status == 200)
                {
                  console.log('Success creating account');
                  router.navigate('/home');
                }
                else{
                  // if the database returns an error the firebase account gets deleted
                  // will change this if we can send the req before the firebase account is created & update db once token is recieved
                  console.log('Error with database');
                  user.delete();
                }
              })
            .catch(error => {
              console.error('Error creating account with database', error);
            });
        }
        catch(error){
          console.error('Error creating account with firebase', error);
        };
      }
      return (
        <View className='items-center'>
          <Text className='text-xl'>Register for Dwellow</Text>
          <Text className='font-semibold'>I am registering as a(n)...</Text>
          <Picker selectedValue={userType}
              onValueChange={(text, index) => setUserType(text)}>
                <Picker.Item label="Please select..."/>
            <Picker.Item label="Tenant" value='tenant' />
            <Picker.Item label="Admin" value='admin' />
          </Picker>
          <Text className='font-semibold'>Invite Code</Text>
          <TextInput
            value={inviteCode}
            onChangeText={text => setInviteCode(text)}
            className='text-opacity-50 border'
            placeholder="Invite Code"
          />
          <Text className='font-semibold'>First Name</Text>
          <TextInput 
            value={firstName}
            onChangeText={text => setFirstName(text)}
            className='text-opacity-50 border'
            placeholder="First Name"
          />
          <Text className='font-semibold'>Last Name</Text>
          <TextInput 
            value={lastName}
            onChangeText={text => setLastName(text)}
            className='text-opacity-50 border'
            placeholder="Last Name"
          />
          <Text className='font-semibold'>Phone Number</Text>
          <TextInput 
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            textContentType="telephoneNumber"
            className='text-opacity-50 border'
            placeholder="Enter Phone Number"
            />
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
            onPress={onRegisterPressed}>
              <button>Register</button>
          </Pressable>
          <Text>
          Already have an account?
        <Pressable>
            <Text className="text-decoration-line: underline"><Link href="/login">Login</Link></Text>
        </Pressable>
      </Text>
        </View>
)}