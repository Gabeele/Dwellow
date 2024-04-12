import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import InfoIcon from "../assets/info-circle.svg";
import API from "@/utils/Api";

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
    if(accepted)
        {
            try{
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const token = await user.getIdToken();
                
                // NEEDS TO BE UPDATED
                // note: invite code is not used here
                API.post(`/public/account`, {email, userType, fullName, phoneNumber})
                  .then((response) => 
                    {
                      if( response.status == 200)
                      {
                        console.log('Success creating account');
                        // check invite code here?
                        // auto log user in and nav to home
                        handleLogin()
                      }
                      else{
                        // if the database returns an error the firebase account gets deleted
                        // will change this if we can send the req before the firebase account is created & update db once token is recieved
                        console.log("Can't add info to database");
                        user.delete();
                      }
                    })
                  .catch((error: Error) => {
                    console.error("Database error: ", error);
                    console.log("Deleting firebase account");
                    user.delete();
                  });
              }
              catch(error: any){
                console.error('Error creating account with firebase', error);

                if(error.message == "Firebase: Error (auth/invalid-email).")
                    setErrorMessage("Please enter a valid email");
                else if(error.message == "Firebase: Error (auth/missing-password).")
                    setErrorMessage("Please enter a valid password");
              };
        }
        else
        {
            setErrorMessage("Please accept the terms and conditions");
            console.log("Terms and conditions not accepted");
        }
    };

    const handleLogin = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log("Login successful");
          navigate("/home");
        } catch (error: any) {
          console.error("Login error:", error.message);
          navigate("/login");
        }
      };

  return (
    <div className="flex justify-center flex-col items-center h-screen bg-dwellow-white">
      <div className="bg-white p-8 rounded shadow items-center">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-primary flex justify-center items-center">Register for Dwellow</h1>
        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        <div className="flex flex-row space-x-4">
            <div>
                <p className="font-semibold text-dwellow-black w-40">I am a(n)...</p>
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
        {/* INVITE CODE LOGIC IS HERE IDK IF IT SHOULD BE HERE OR ON THE NEXT PAGE */} 
            <div>
                <p className="font-semibold text-dwellow-black inline-flex">Invite Code
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <img className="h-5 pl-1 pt-1 hover:cursor-help" src={InfoIcon}/>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>Get your invite code from an admin!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </p>
                <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={inviteCode}
                    onChange={setInviteCode}
                >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={4} />
                </InputOTPGroup>
                </InputOTP>
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
        <div className="h-4" />
        
        <p className="text-center text-dwellow-primary text-sm font-medium">
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
