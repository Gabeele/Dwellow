import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  colorScheme: ColorScheme.light(
    background: Color.fromRGBO(229, 229, 229, 1),
    primary: Color.fromRGBO(16, 73, 17, 1),
    secondary: Colors.grey.shade700,
    onPrimary: Colors.white,
    onSecondary: Colors.black,
  ),
  textTheme: GoogleFonts.comfortaaTextTheme().copyWith(
    bodyText1: TextStyle(
        color: Colors.black), // You can customize other text styles as well
    bodyText2: TextStyle(color: Colors.black),
  ),
);
