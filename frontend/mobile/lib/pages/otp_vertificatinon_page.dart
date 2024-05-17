import 'package:flutter/material.dart';
import 'package:mobile/components/button.dart';
import 'package:mobile/components/otp_input.dart';
import 'package:mobile/helper/helper_functions.dart';

class OTPVerificationPage extends StatefulWidget {
  final String email;
  OTPVerificationPage({required this.email});

  @override
  _OTPVerificationPageState createState() => _OTPVerificationPageState();
}

class _OTPVerificationPageState extends State<OTPVerificationPage> {
  void verifyOTP(String otp) async {
    showDialog(
      context: context,
      builder: (context) => Center(
        child: CircularProgressIndicator(),
      ),
    );

    // Simulate an API call
    await Future.delayed(Duration(seconds: 2));

    Navigator.pop(context);
    displayMessage("OTP Verified", context);

    // Navigate to another page if needed
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(25.0),
                child: Column(
                  children: [
                    Text(
                      "Link account with unit.",
                      // Title
                      style: TextStyle(fontSize: 24),
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      "Enter the 6-digit unit link code sent to ${widget.email}",
                      style: TextStyle(fontSize: 18),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 25),
                    OTPInput(
                      length: 6,
                      onCompleted: (otp) {
                        verifyOTP(otp);
                      },
                    ),
                    const SizedBox(height: 25),
                    MyButton(
                        text: "Link to Unit",
                        onTap: () {
                          // Optionally, you can call verifyOTP here if you have the complete OTP in a different way
                        }),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
