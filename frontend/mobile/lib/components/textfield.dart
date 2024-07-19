import 'package:flutter/material.dart';

class MyTextField extends StatefulWidget {
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
  _MyTextFieldState createState() => _MyTextFieldState();
}

class _MyTextFieldState extends State<MyTextField> {
  FocusNode _focusNode = FocusNode();
  late Color _fillColor;

  @override
  void initState() {
    super.initState();
    _fillColor = Color(0xFF737782); // Custom gray color
    _focusNode.addListener(() {
      setState(() {
        _fillColor = _focusNode.hasFocus ? Colors.black : Color(0xFF737782);
      });
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Color textColor = Colors.white; // White text color

    return TextFormField(
      controller: widget.controller,
      style: TextStyle(color: textColor),
      focusNode: _focusNode,
      decoration: InputDecoration(
        filled: true,
        fillColor: _fillColor, // Dynamic background color
        labelText: widget.hintText,
        labelStyle: TextStyle(color: Colors.white.withOpacity(0.8)),
        floatingLabelBehavior: FloatingLabelBehavior.auto,
        hintStyle: TextStyle(color: Colors.white.withOpacity(0.8)),
        contentPadding: EdgeInsets.symmetric(vertical: 15, horizontal: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: Colors.white),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: Colors.white),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: Colors.white),
        ),
      ),
      obscureText: widget.obscureText,
      validator: widget.validator,
    );
  }
}
