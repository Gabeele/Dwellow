import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/components/button.dart';
import 'package:mobile/components/textfield.dart';
import 'package:mobile/components/wave_container.dart';
import 'package:mobile/helper/helper_functions.dart';

class ForgotPasswordPage extends StatefulWidget {
  final String logo = 'images/logo.svg';
  @override
  _ForgotPasswordPageState createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    // Set the status bar color to match the theme
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors
          .transparent, // Use transparent if you want to show the header background color
      statusBarIconBrightness:
          Brightness.light, // Change this based on your theme
    ));
  }

  void resetPassword() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    showDialog(
      context: context,
      builder: (context) => Center(
        child: CircularProgressIndicator(),
      ),
    );

    try {
      await FirebaseAuth.instance.sendPasswordResetEmail(
        email: emailController.text,
      );

      Navigator.pop(context);
      displayMessage(
          'Password reset email sent. Please check your inbox.', context);
    } on FirebaseAuthException catch (e) {
      Navigator.pop(context);
      String errorMessage;
      switch (e.code) {
        case 'user-not-found':
          errorMessage = 'No user found for that email.';
          break;
        case 'invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
      displayMessage(errorMessage, context);
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
                      const SizedBox(height: 25),
                      // Reset Password button
                      MyButton(text: "Reset Password", onTap: resetPassword),
                      const SizedBox(height: 10),
                      // Back to Login
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Remember your password? ",
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.secondary,
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              Navigator.pop(context);
                            },
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
