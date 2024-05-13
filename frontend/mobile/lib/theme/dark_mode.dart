import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    background: const Color.fromARGB(255, 23, 23, 23),
    primary: Color.fromRGBO(39, 149, 41, 1),
    secondary: Colors.grey.shade200,
    onPrimary: Colors.white,
    onSecondary: Colors.grey.shade900,
  ),
  textTheme: GoogleFonts.comfortaaTextTheme().copyWith(
    bodyLarge: TextStyle(color: Colors.white),
    bodyMedium: TextStyle(color: Colors.white),
  ),
);
