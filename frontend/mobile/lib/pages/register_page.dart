import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile/components/button.dart';
import 'package:mobile/components/textfield.dart';
import 'package:mobile/components/wave_container.dart';
import 'package:mobile/helper/helper_functions.dart';
import 'package:mobile/pages/otp_verification_page.dart';

class RegisterPage extends StatefulWidget {
  final String logo;
  final VoidCallback onTap;

  const RegisterPage({required this.logo, required this.onTap, Key? key})
      : super(key: key);

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final fullNameController = TextEditingController();
  final phoneNumberController = TextEditingController();

  void register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    showDialog(
      context: context,
      builder: (context) => Center(
        child: CircularProgressIndicator(),
      ),
    );

    if (passwordController.text != confirmPasswordController.text) {
      Navigator.pop(context);
      displayMessage("Passwords do not match", context);
    } else {
      bool fbResult = await handleUserRegistrationFirebase(
          emailController.text, passwordController.text);

      if (fbResult) {
        bool dResult = await handleUserRegistrationDwellow(
            fullNameController.text,
            emailController.text,
            phoneNumberController.text);

        if (!dResult) {
          await handleRemoveUserFirebase();
          if (mounted) Navigator.pop(context);
          displayMessage("Registration failed. Please try again.", context);
        } else {
          Navigator.pop(context);
          // Navigate to OTP Verification Page
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  OTPVerificationPage(email: emailController.text),
            ),
          );
        }
      }
    }
  }

  Future<bool> handleUserRegistrationFirebase(
      String email, String password) async {
    try {
      UserCredential? userCredential = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(email: email, password: password);
      return true;
    } on FirebaseAuthException catch (e) {
      Navigator.pop(context);
      String errorMessage;
      switch (e.code) {
        case 'email-already-in-use':
          errorMessage = 'The email address is already in use.';
          break;
        case 'invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'operation-not-allowed':
          errorMessage = 'Operation not allowed.';
          break;
        case 'weak-password':
          errorMessage = 'The password is too weak.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
      displayMessage(errorMessage, context);
    }
    return false;
  }

  Future<bool> handleUserRegistrationDwellow(
      String fullName, String email, String phoneNumber) async {
    try {
      final response = await http.post(
        Uri.parse('https://api.dwellow.ca/register'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'fullName': fullName,
          'email': email,
          'phoneNumber': phoneNumber,
        }),
      );

      if (response.statusCode == 201) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      // Handle any exceptions here
      return false;
    }
  }

  Future<void> handleRemoveUserFirebase() async {
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        await user.delete();
      }
    } catch (e) {
      // Handle any exceptions here
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                WaveHeader(
                  height: MediaQuery.of(context).size.height * 0.4,
                  logo: widget.logo,
                  appName: "Dwellow",
                ),
                Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Full Name
                      MyTextField(
                        hintText: "Full Name",
                        obscureText: false,
                        controller: fullNameController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your full name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Phone Number
                      MyTextField(
                        hintText: "Phone Number",
                        obscureText: false,
                        controller: phoneNumberController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your phone number';
                          }
                          if (!RegExp(r'^\+?[0-9]{10,15}$').hasMatch(value)) {
                            return 'Please enter a valid phone number';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Email
                      MyTextField(
                        hintText: "Email",
                        obscureText: false,
                        controller: emailController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email';
                          }
                          if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                            return 'Please enter a valid email address';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Password
                      MyTextField(
                        hintText: "Password",
                        obscureText: true,
                        controller: passwordController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          if (value.length < 6) {
                            return 'Password must be at least 6 characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 10),
                      // Confirm Password
                      MyTextField(
                        hintText: "Confirm Password",
                        obscureText: true,
                        controller: confirmPasswordController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please confirm your password';
                          }
                          if (value != passwordController.text) {
                            return 'Passwords do not match';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 25),
                      // Register button
                      MyButton(text: "Register", onTap: register),
                      const SizedBox(height: 10),
                      // Already have an account? Login
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Already have an account? ",
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.secondary,
                            ),
                          ),
                          GestureDetector(
                            onTap: widget.onTap,
                            child: Text(
                              "Login here",
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
