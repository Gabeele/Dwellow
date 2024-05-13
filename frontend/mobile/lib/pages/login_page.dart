import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/components/button.dart';
import 'package:mobile/components/login_container.dart';
import 'package:mobile/components/textfield.dart';
import 'package:mobile/helper/helper_functions.dart';

class LoginPage extends StatefulWidget {
  void Function()? onTap;
  LoginPage({super.key, required this.onTap});
  final String logo = 'images/logo.svg';

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  TextEditingController emailController = TextEditingController();

  TextEditingController passwordController = TextEditingController();

  void login() async {
    showDialog(
      context: context,
      builder: (context) => Center(
        child: CircularProgressIndicator(),
      ),
    );

    try {
      UserCredential? userCredential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: emailController.text,
        password: passwordController.text,
      );

      Navigator.pop(context);
    } on FirebaseAuthException catch (e) {
      Navigator.pop(context);
      displayMessage(e.message!, context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SizedBox(
        height: height,
        child: Stack(
          children: [
            // Positioned(height: height * 0.43, child: LoginContainer()),
            Center(
              child: Padding(
                padding: const EdgeInsets.all(25.0),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Logo
                      SvgPicture.asset(
                        widget.logo,
                        semanticsLabel: 'Dwellow Logo',
                        height: 100.0, // Set the size as needed
                      ),
                      const SizedBox(height: 10),
                      // App Name
                      Text(
                        "Dwellow",
                        style: TextStyle(
                          fontSize: 40,
                          fontFamily: GoogleFonts.comfortaa().fontFamily,
                          fontWeight: FontWeight.w500,
                        ),
                      ),

                      // Email
                      const SizedBox(height: 50),

                      MyTextField(
                          hintText: "Email",
                          obscureText: false,
                          controller: emailController),

                      // Password
                      const SizedBox(height: 10),

                      MyTextField(
                          hintText: "Password",
                          obscureText: true,
                          controller: passwordController),

                      // Forgot password
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text(
                            "Forgot password?",
                            style: TextStyle(
                                color: Theme.of(context).colorScheme.secondary),
                          ),
                        ],
                      ),

                      // Login button
                      const SizedBox(height: 25),

                      MyButton(text: "Login", onTap: login),

                      // Don't have an account? Register
                      const SizedBox(height: 10),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Don't have an account? ",
                            style: TextStyle(
                                color: Theme.of(context).colorScheme.secondary),
                          ),
                          GestureDetector(
                            onTap: widget.onTap,
                            child: Text(
                              "Register",
                              style: TextStyle(
                                  color: Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
