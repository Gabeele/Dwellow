import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

class WaveHeader extends StatelessWidget {
  final double height;
  final String logo;
  final String appName;

  const WaveHeader({
    Key? key,
    this.height = 200,
    required this.logo,
    required this.appName,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      child: Stack(
        children: [
          CustomPaint(
            size: Size(double.infinity, height),
            painter: _WavePainter(),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SvgPicture.asset(
                  logo,
                  semanticsLabel: 'Dwellow Logo',
                  height: 100.0,
                  color: Colors.white,
                ),
                const SizedBox(height: 10),
                Text(
                  appName,
                  style: TextStyle(
                    fontSize: 40,
                    fontFamily: GoogleFonts.inter().fontFamily,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _WavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Color.fromARGB(255, 16, 16, 17) // Set the color to 0x737782
      ..style = PaintingStyle.fill;

    final path = Path()
      ..lineTo(0, size.height - 40)
      ..quadraticBezierTo(
          size.width / 4, size.height, size.width / 2, size.height - 40)
      ..quadraticBezierTo(
          3 / 4 * size.width, size.height - 80, size.width, size.height - 40)
      ..lineTo(size.width, 0)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}
