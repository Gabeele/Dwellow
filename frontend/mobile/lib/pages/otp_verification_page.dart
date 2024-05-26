import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/components/button.dart';
import 'package:mobile/components/otp_input.dart';
import 'package:mobile/helper/helper_functions.dart';

class OTPVerificationPage extends StatefulWidget {
  @override
  _OTPVerificationPageState createState() => _OTPVerificationPageState();
}

class _OTPVerificationPageState extends State<OTPVerificationPage> {
  void verifyOTP(String otp) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(
        child: CircularProgressIndicator(),
      ),
    );

    bool otpVerified = await verifyOtpApiCall(otp);

    Navigator.pop(context);

    if (otpVerified) {
      displayMessage("OTP Verified", context);
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      displayMessage(
          "OTP Verification Failed. Contact the property administrator.",
          context);
    }
  }

  Future<bool> verifyOtpApiCall(String otp) async {
    try {
      User? user = FirebaseAuth.instance.currentUser;
      String? token = await user?.getIdToken();
      final response = await http.post(
        Uri.parse('https://api.dwellow.ca/inventatio/$otp'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      // Handle any exceptions here
      return false;
    }
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
                      style: TextStyle(fontSize: 24),
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      "Enter the 6-digit unit link code sent to your email.",
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
