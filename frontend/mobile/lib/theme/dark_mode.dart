import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    background: const Color.fromARGB(255, 23, 23, 23),
    primary: Color.fromRGBO(67, 123, 58, 1),
    secondary: Colors.grey.shade200,
    onPrimary: Colors.white,
    onSecondary: Colors.grey.shade900,
    error: Colors.red,
    onError: Colors.white,
    surface: const Color.fromARGB(255, 30, 30, 30),
    onSurface: Colors.white,
  ),
  primaryColor: Color.fromRGBO(67, 123, 58, 1),
  hintColor: Colors.grey.shade200,
  scaffoldBackgroundColor: const Color.fromARGB(255, 23, 23, 23),
  appBarTheme: AppBarTheme(
    color: Color.fromRGBO(67, 123, 58, 1),
    iconTheme: IconThemeData(color: Colors.white),
  ),
  textTheme: GoogleFonts.comfortaaTextTheme().copyWith(
    bodyLarge: TextStyle(color: Colors.white),
    bodyMedium: TextStyle(color: Colors.white),
    bodySmall: TextStyle(color: Colors.grey.shade700),
    displayLarge: TextStyle(color: Colors.white),
    displayMedium: TextStyle(color: Colors.white),
    displaySmall: TextStyle(color: Colors.white),
    headlineLarge: TextStyle(color: Colors.white),
    headlineMedium: TextStyle(color: Colors.white),
    headlineSmall: TextStyle(color: Colors.white),
    titleLarge: TextStyle(color: Colors.white),
    titleMedium: TextStyle(color: Colors.white),
    titleSmall: TextStyle(color: Colors.white),
    labelLarge: TextStyle(color: Colors.black),
  ),
  buttonTheme: ButtonThemeData(
    buttonColor: Color.fromRGBO(67, 123, 58, 1),
    textTheme: ButtonTextTheme.primary,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      foregroundColor: Colors.white,
      backgroundColor: Color.fromRGBO(67, 123, 58, 1),
      textStyle: GoogleFonts.comfortaa(
        fontSize: 16,
        fontWeight: FontWeight.bold,
      ),
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: Color.fromRGBO(67, 123, 58, 1),
      side: BorderSide(color: Color.fromRGBO(67, 123, 58, 1)),
      textStyle: GoogleFonts.comfortaa(
        fontSize: 16,
        fontWeight: FontWeight.bold,
      ),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: Color.fromRGBO(67, 123, 58, 1),
      textStyle: GoogleFonts.comfortaa(
        fontSize: 16,
        fontWeight: FontWeight.bold,
      ),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color.fromARGB(255, 30, 30, 30),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: BorderSide(color: Colors.grey.shade700),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: BorderSide(color: Color.fromRGBO(67, 123, 58, 1)),
    ),
    labelStyle: TextStyle(color: Colors.grey.shade200),
    hintStyle: TextStyle(color: Colors.grey.shade500),
  ),
  iconTheme: IconThemeData(
    color: Colors.grey.shade200,
  ),
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    backgroundColor: Color.fromRGBO(67, 123, 58, 1),
    foregroundColor: Colors.white,
  ),
  cardTheme: CardTheme(
    color: const Color.fromARGB(255, 30, 30, 30),
    shadowColor: Colors.grey.shade800,
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8.0),
    ),
  ),
  dividerTheme: DividerThemeData(
    color: Colors.grey.shade700,
    thickness: 1,
  ),
  chipTheme: ChipThemeData(
    backgroundColor: Colors.grey.shade800,
    disabledColor: Colors.grey.shade600,
    selectedColor: Color.fromRGBO(67, 123, 58, 1),
    secondarySelectedColor: Color.fromRGBO(67, 123, 58, 1),
    padding: EdgeInsets.symmetric(horizontal: 8.0),
    labelStyle: TextStyle(color: Colors.white),
    secondaryLabelStyle: TextStyle(color: Colors.black),
    brightness: Brightness.dark,
  ),
  tabBarTheme: TabBarTheme(
    labelColor: Color.fromRGBO(67, 123, 58, 1),
    unselectedLabelColor: Colors.grey.shade200,
    labelStyle: GoogleFonts.comfortaa(fontSize: 16),
    unselectedLabelStyle: GoogleFonts.comfortaa(fontSize: 16),
  ),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: const Color.fromARGB(255, 30, 30, 30),
    selectedItemColor: Color.fromRGBO(67, 123, 58, 1),
    unselectedItemColor: Colors.grey.shade200,
    selectedLabelStyle: GoogleFonts.comfortaa(fontSize: 12),
    unselectedLabelStyle: GoogleFonts.comfortaa(fontSize: 12),
  ),
);
