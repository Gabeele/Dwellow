import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  let [accepted = false] = useState(Boolean);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async() => {
    let fullName = firstName.concat(" " + lastName);
    
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
                // auto log user in and nav to home
                handleLogin()
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
    };

    const handleLogin = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log("Login successful");
          navigate("/home");
        } catch (error: any) {
          console.error("Login error:", error.message);
          if (
            error.message == "Firebase: Error (auth/user-not-found)." ||
            error.message == "Firebase: Error (auth/wrong-password)."
          ) {
            setErrorMessage("Invalid email or password");
          }
        }
      };

  return (
    <div className="flex justify-center flex-col items-center h-screen bg-dwellow-white">
      <div className="bg-white p-8 rounded shadow items-center">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-primary flex justify-center items-center">Register for Dwellow</h1>
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <div className="flex-row space-x-5">
            <div>
                <p className="font-semibold text-dwellow-black">I am registering as a(n)...</p>
                <Select
                    value={userType}
                    onValueChange={(e) => setUserType(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Please Select..."/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tenant">Tenant</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                </Select>
            </div>
        </div>
        <div className="h-4" />
        
        <div className="flex flex-row space-x-5">
            <div>
                <p className="font-semibold text-dwellow-black">First Name</p>
                <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <p className="font-semibold text-dwellow-black">Last Name</p>
                <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>
        </div>
        <div className="h-4" />

        <p className="font-semibold text-dwellow-black">Phone Number</p>
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="h-4" />

        <p className="font-semibold text-dwellow-black">Email Address</p>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="h-4" />

        <p className="font-semibold text-dwellow-black">Password</p>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <p className="text-center mt-4 text-dwellow-primary text-sm font-medium">
            <Checkbox className="mr-1"
                onCheckedChange={(checked) => 
                    {
                        if(checked === 'indeterminate')
                            accepted == true
                        else if(checked === true)
                            accepted = true
                        else 
                            accepted = false
                    }
                }
                
            />
            I have read and understood the {" "}
            <a href="" className="text-dwellow-primary font-medium underline">
            Terms and Conditions
            </a>
        </p>
        <div className="h-4" />
        <div className="justify-center flex items-center"><Button className="bg-dwellow-primary text-xl p-6 pt-4 pb-4" onClick={handleRegister}>Register</Button></div>
      </div>

      <p className="text-center mt-4 text-dwellow-primary text-sm font-semibold">
          Already have an account?{" "}
          <a href="/login" className="text-dwellow-primary font-semibold hover:underline">
            Login
          </a>
        </p>
      <footer className="w-screen bg-dwellow-primary flex flex-row items-center space-x-7 justify-center text-white font-normal text-sm absolute bottom-0">
        <a href="" className="hover:underline">Terms of Use</a>
        <p>Dwellow © 2024</p>
        <a href="" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default Register;
