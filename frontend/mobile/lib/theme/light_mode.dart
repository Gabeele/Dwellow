import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  primaryColor: Color(0x3D6945), // Hunter green
  scaffoldBackgroundColor: Colors.white, // Main body background to white
  appBarTheme: AppBarTheme(
    color: Color(0xFF1C1C22), // dwellow-dark
    iconTheme: IconThemeData(color: Colors.white),
    titleTextStyle: GoogleFonts.inter(
      fontSize: 18,
      fontWeight: FontWeight.normal,
      color: Colors.white,
    ),
  ),
  textTheme: GoogleFonts.interTextTheme().copyWith(
    headlineMedium: TextStyle(fontSize: 18, color: Colors.black),
    titleLarge: TextStyle(fontSize: 18, color: Colors.black),
    bodyMedium: TextStyle(fontSize: 14, color: Colors.black),
    bodySmall: TextStyle(fontSize: 12, color: Color(0x737782)), // Slate gray
  ),
  cardTheme: CardTheme(
    color: Colors.white,
    shadowColor: Color(0x737782), // Slate gray
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8.0),
    ),
  ),
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    backgroundColor: Color(0x3D6945), // Hunter green
    foregroundColor: Colors.white,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      foregroundColor: Color(0xFF1C1C22),
      backgroundColor: Colors.white, // Button text color (dwellow dark)
      textStyle: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.bold,
      ),
      side: BorderSide(color: Color(0xFF1C1C22)), // dwellow dark border
    ),
  ),
  colorScheme: ColorScheme.light(
    background: Colors.white, // Main body background to white
    primary: Color(0x3D6945), // Hunter green
    secondary: Color(0x737782), // Slate gray
    onPrimary: Colors.white,
    onSecondary: Colors.black,
    error: Colors.red,
    onError: Colors.white,
    surface: Colors.white,
    onSurface: Colors.black,
  ),
);
