import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class OTPInput extends StatefulWidget {
  final int length;
  final Function(String) onCompleted;

  OTPInput({required this.length, required this.onCompleted});

  @override
  _OTPInputState createState() => _OTPInputState();
}

class _OTPInputState extends State<OTPInput> {
  List<TextEditingController> _controllers = [];
  List<FocusNode> _focusNodes = [];

  @override
  void initState() {
    super.initState();
    _controllers =
        List.generate(widget.length, (index) => TextEditingController());
    _focusNodes = List.generate(widget.length, (index) => FocusNode());
  }

  @override
  void dispose() {
    _controllers.forEach((controller) => controller.dispose());
    _focusNodes.forEach((focusNode) => focusNode.dispose());
    super.dispose();
  }

  void _onChanged(String value, int index) {
    if (value.isNotEmpty) {
      if (index < widget.length - 1) {
        FocusScope.of(context).requestFocus(_focusNodes[index + 1]);
      } else {
        FocusScope.of(context).unfocus();
        String otp = _controllers.map((controller) => controller.text).join();
        widget.onCompleted(otp);
      }
    }
  }

  void _handleBackspace(int index) {
    if (_controllers[index].text.isEmpty && index > 0) {
      FocusScope.of(context).requestFocus(_focusNodes[index - 1]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return RawKeyboardListener(
      focusNode: FocusNode(),
      onKey: (RawKeyEvent event) {
        if (event is RawKeyDownEvent &&
            event.logicalKey == LogicalKeyboardKey.backspace) {
          for (int i = 0; i < _focusNodes.length; i++) {
            if (_focusNodes[i].hasFocus) {
              _handleBackspace(i);
              break;
            }
          }
        }
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(widget.length, (index) {
          return Container(
            width: 50,
            height: 50,
            child: TextField(
              controller: _controllers[index],
              focusNode: _focusNodes[index],
              maxLength: 1,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 24),
              keyboardType: TextInputType.text,
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[A-Za-z0-9]')),
              ],
              decoration: InputDecoration(
                counterText: '',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
              onChanged: (value) => _onChanged(value, index),
            ),
          );
        }),
      ),
    );
  }
}
