import 'package:flutter/material.dart';

class MyTextField extends StatelessWidget {
  final String hintText;
  final bool obscureText;
  final TextEditingController controller;
  final String? Function(String?)? validator;

  const MyTextField({
    Key? key,
    required this.hintText,
    required this.obscureText,
    required this.controller,
    this.validator,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Color customGray = Color(0xFF737782); // Custom gray color
    final Color textColor = Colors.black; // Black text color

    return TextFormField(
      controller: controller,
      style: TextStyle(color: textColor),
      decoration: InputDecoration(
        filled: true,
        fillColor: Colors.white, // Background color
        labelText: hintText,
        labelStyle: TextStyle(color: customGray.withOpacity(0.8)),
        floatingLabelBehavior: FloatingLabelBehavior.auto,
        hintStyle: TextStyle(color: customGray.withOpacity(0.8)),
        contentPadding: EdgeInsets.symmetric(vertical: 15, horizontal: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: customGray),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: customGray),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: customGray),
        ),
      ),
      obscureText: obscureText,
      validator: validator,
    );
  }
}
