import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mobile/auth/auth.dart';
import 'package:mobile/pages/chat_page.dart';
import 'package:mobile/pages/forgotPassword_page.dart';
import 'package:mobile/pages/home_page.dart';
import 'package:mobile/pages/login_page.dart';
import 'package:mobile/pages/register_page.dart';
import 'package:mobile/theme/dark_mode.dart';
import 'package:mobile/theme/light_mode.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dwellow',
      theme: lightMode,
      darkTheme: darkMode,
      initialRoute: '/',
      routes: {
        '/': (context) => AuthPage(),
        '/home': (context) => HomePage(),
        '/chat': (context) => ChatPage(),
      },
    );
  }
}
