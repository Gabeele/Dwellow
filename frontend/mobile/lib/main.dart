import 'package:flutter/material.dart';
import 'package:mobile/auth/auth.dart';
import 'package:mobile/auth/login_or_register.dart';
import 'package:mobile/firebase_options.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:mobile/theme/dark_mode.dart';
import 'package:mobile/theme/light_mode.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Dwellow',
      theme: lightMode,
      darkTheme: darkMode,
      home: const AuthPage(),
    );
  }
}
