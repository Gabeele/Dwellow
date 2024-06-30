import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import API from "@/utils/Api";
import LandingNavigation from "@/components/LandingNavigation";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType] = useState("admin");
  let [accepted = false] = useState(Boolean);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    let fullName = firstName.concat(" " + lastName);
    if (accepted) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        console.log(userType);

        API.post(`/public/account`, { email, userType, fullName, phoneNumber })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              console.log("Success creating account");
              handleLogin();
            } else {
              // if the database returns an error the firebase account gets deleted
              // will change this if we can send the req before the firebase account is created & update db once token is recieved
              setErrorMessage(
                "There was an error creating your account. Please try again."
              );
              user.delete();
            }
          })
          .catch((error: Error) => {
            console.error(error);
            user.delete();
          });
      } catch (error: any) {
        console.error("Error creating account with firebase", error);

        if (error.message == "Firebase: Error (auth/invalid-email).")
          setErrorMessage("Please enter a valid email");
        else if (error.message == "Firebase: Error (auth/missing-password).")
          setErrorMessage("Please enter a valid password");
      }
    } else {
      setErrorMessage("Please accept the terms and conditions");
      console.log("Terms and conditions not accepted");
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message);
      navigate("/login");
    }
  };

  return (
    <div>
      <LandingNavigation/>
      <div className="absolute top-0 flex justify-center flex-col items-center h-screen w-full bg-dwellow-white-200">
        <div className="bg-dwellow-white-100 p-8 rounded shadow items-center">
          <h1 className="text-3xl font-bold mb-4 text-dwellow-primary-300 flex justify-center items-center">
            Admin Register for Dwellow
          </h1>
          {errorMessage && (
            <div className="mb-4 text-center text-red-500">{errorMessage}</div>
          )}
          <div className="flex flex-row space-x-5">
            <div>
              <p className="font-semibold text-dwellow-dark-200">First Name</p>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <p className="font-semibold text-dwellow-dark-200">Last Name</p>
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="h-4" />

          <p className="font-semibold text-dwellow-dark-200">Phone Number</p>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="h-4" />

          <p className="font-semibold text-dwellow-dark-200">Email Address</p>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="h-4" />

          <p className="font-semibold text-dwellow-dark-200">Password</p>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="h-4" />
          <div className="flex justify-center items-center space-x-2">
            <Checkbox
              onCheckedChange={(checked) => {
                if (checked === "indeterminate") accepted == true;
                else if (checked === true) accepted = true;
                else accepted = false;
              }}
            />
            <p className="text-dwellow-primary-300 text-sm font-medium">
              I have read and understood the{" "}
              <a href="" className="text-dwellow-primary-300 font-medium underline">
                Terms and Conditions
              </a>
            </p>
          </div>
          <div className="h-4" />
          <div className="justify-center flex items-center">
            <Button
              className="bg-dwellow-primary-300 text-xl p-6 pt-4 pb-4"
              onClick={handleRegister}
            >
              Register
            </Button>
          </div>
        </div>

        <p className="text-center mt-4 text-dwellow-primary-300 text-sm font-semibold">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-dwellow-primary-300 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
        <footer className="w-full bg-dwellow-primary-300 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom-0">
          <a href="" className="hover:underline">
            Terms of Use
          </a>
          <p>Dwellow © 2024</p>
          <a href="" className="hover:underline">
            Privacy Policy
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Register;
