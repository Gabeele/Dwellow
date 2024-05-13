import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class LoginContainer extends StatelessWidget {
  LoginContainer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;
    return Stack(
      children: [
        Transform.rotate(
          angle: 32,
          child: Container(
            width: width * 1.5,
            decoration: const BoxDecoration(
              color: Color.fromRGBO(38, 154, 86, 1),
            ),
          ),
        ),
        Transform.rotate(
          angle: 6,
          alignment: Alignment.bottomLeft,
          child: Container(
            width: width * 2,
            height: height * 1.5,
            decoration: const BoxDecoration(
              color: Color.fromRGBO(14, 120, 80, 1),
            ),
          ),
        ),
        Transform.rotate(
          angle: 1,
          alignment: Alignment.topRight,
          child: Container(
            width: width * 0.5,
            decoration: const BoxDecoration(
              color: Color.fromRGBO(126, 163, 112, 1),
            ),
          ),
        ),
      ],
    );
  }
}
