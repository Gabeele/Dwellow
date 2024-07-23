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
    _fillColor = Colors.grey[200]!; // Lighter gray color for the fill
    _focusNode.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Color textColor = Colors.black; // Text color

    return TextFormField(
      controller: widget.controller,
      style: TextStyle(color: textColor),
      focusNode: _focusNode,
      decoration: InputDecoration(
        filled: true,
        fillColor: _fillColor, // Use dynamic fill color
        labelText: widget.hintText,
        labelStyle: TextStyle(color: Colors.black.withOpacity(0.8)),
        floatingLabelBehavior: FloatingLabelBehavior.auto,
        hintStyle: TextStyle(
            color: Colors.black.withOpacity(0.5)), // Lighter hint text
        contentPadding: EdgeInsets.symmetric(vertical: 15, horizontal: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: Colors.black), // Border color
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide: BorderSide(color: Colors.black), // Border color
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(5),
          borderSide:
              BorderSide(color: Colors.blue), // Border color when focused
        ),
      ),
      obscureText: widget.obscureText,
      validator: widget.validator,
    );
  }
}
