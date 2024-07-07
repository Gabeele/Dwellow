import 'package:flutter/material.dart';

void displayMessage(String message, BuildContext context) {
  showDialog(
      context: context,
      builder: (context) => AlertDialog(content: Text(message)));
}

extension StringExtension on String {
  String toCapitalized() {
    if (this.isEmpty) return this;
    return this[0].toUpperCase() + this.substring(1).toLowerCase();
  }
}
