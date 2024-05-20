import 'package:flutter/material.dart';

class MyButton extends StatefulWidget {
  final String text;
  final void Function() onTap;

  const MyButton({
    Key? key,
    required this.text,
    required this.onTap,
  }) : super(key: key);

  @override
  _MyButtonState createState() => _MyButtonState();
}

class _MyButtonState extends State<MyButton> {
  bool _isPressed = false;

  void _handleTapDown(TapDownDetails details) {
    setState(() {
      _isPressed = true;
    });
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() {
      _isPressed = false;
    });
  }

  void _handleTapCancel() {
    setState(() {
      _isPressed = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        decoration: BoxDecoration(
          color: _isPressed
              ? Theme.of(context).colorScheme.primary.withOpacity(0.8)
              : Theme.of(context).colorScheme.primary,
          borderRadius: BorderRadius.circular(8),
          boxShadow: _isPressed
              ? []
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    offset: Offset(0, 4),
                    blurRadius: 4,
                  ),
                ],
        ),
        padding: const EdgeInsets.all(10),
        child: Center(
          child: Text(
            widget.text,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onPrimary,
              fontSize: 24,
            ),
          ),
        ),
      ),
    );
  }
}
