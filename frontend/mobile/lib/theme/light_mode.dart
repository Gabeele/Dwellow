import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  primaryColor: Color.fromRGBO(67, 123, 58, 1),
  hintColor: Colors.grey.shade700,
  scaffoldBackgroundColor: Color.fromRGBO(229, 229, 229, 1),
  appBarTheme: AppBarTheme(
    color: Color.fromRGBO(67, 123, 58, 1),
    iconTheme: IconThemeData(color: Colors.white),
  ),
  textTheme: GoogleFonts.comfortaaTextTheme().copyWith(
    bodyLarge: TextStyle(color: Colors.black),
    bodyMedium: TextStyle(color: Colors.black),
    displayLarge: TextStyle(color: Colors.black),
    displayMedium: TextStyle(color: Colors.black),
    displaySmall: TextStyle(color: Colors.black),
    headlineMedium: TextStyle(color: Colors.black),
    headlineSmall: const TextStyle(color: Colors.black),
    titleLarge: TextStyle(color: Colors.black),
    titleMedium: TextStyle(color: Colors.black),
    titleSmall: TextStyle(color: Colors.black),
    labelLarge: TextStyle(color: Colors.white),
    bodySmall: TextStyle(color: Colors.grey.shade700),
    labelSmall: TextStyle(color: Colors.grey.shade700),
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
    fillColor: Colors.white,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: BorderSide(color: Colors.grey.shade400),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: BorderSide(color: Color.fromRGBO(67, 123, 58, 1)),
    ),
    labelStyle: TextStyle(color: Colors.grey.shade700),
    hintStyle: TextStyle(color: Colors.grey.shade500),
  ),
  iconTheme: IconThemeData(
    color: Colors.grey.shade700,
  ),
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    backgroundColor: Color.fromRGBO(67, 123, 58, 1),
    foregroundColor: Colors.white,
  ),
  cardTheme: CardTheme(
    color: Colors.white,
    shadowColor: Colors.grey.shade300,
    elevation: 4,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8.0),
    ),
  ),
  dividerTheme: DividerThemeData(
    color: Colors.grey.shade400,
    thickness: 1,
  ),
  chipTheme: ChipThemeData(
    backgroundColor: Colors.grey.shade200,
    disabledColor: Colors.grey.shade100,
    selectedColor: Color.fromRGBO(67, 123, 58, 1),
    secondarySelectedColor: Color.fromRGBO(67, 123, 58, 1),
    padding: EdgeInsets.symmetric(horizontal: 8.0),
    labelStyle: TextStyle(color: Colors.black),
    secondaryLabelStyle: TextStyle(color: Colors.white),
    brightness: Brightness.light,
  ),
  tabBarTheme: TabBarTheme(
    labelColor: Color.fromRGBO(67, 123, 58, 1),
    unselectedLabelColor: Colors.grey.shade700,
    labelStyle: GoogleFonts.comfortaa(fontSize: 16),
    unselectedLabelStyle: GoogleFonts.comfortaa(fontSize: 16),
  ),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: Color.fromRGBO(67, 123, 58, 1),
    unselectedItemColor: Colors.grey.shade700,
    selectedLabelStyle: GoogleFonts.comfortaa(fontSize: 12),
    unselectedLabelStyle: GoogleFonts.comfortaa(fontSize: 12),
  ),
  colorScheme: ColorScheme.light(
    background: Color.fromRGBO(229, 229, 229, 1),
    primary: Color.fromRGBO(67, 123, 58, 1),
    secondary: Colors.grey.shade700,
    onPrimary: Colors.white,
    onSecondary: Colors.black,
    error: Colors.red,
    onError: Colors.white,
    surface: Colors.white,
    onSurface: Colors.black,
  ).copyWith(background: Color.fromRGBO(229, 229, 229, 1)),
);
