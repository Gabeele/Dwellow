import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class NavDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color: Color(0xFF1C1C22), // dwellow dark
            ),
            child: Text(
              'Menu',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: Icon(Icons.home,
                color: Colors.black), // Theme.of(context).primaryColor
            title: Text(
              'Dashboard',
              style: TextStyle(color: Colors.black),
            ),
            onTap: () {
              Navigator.pushNamed(context, '/home');
            },
          ),
          ListTile(
            leading: Icon(Icons.account_circle, color: Colors.black),
            title: Text(
              'Account',
              style: TextStyle(color: Colors.black),
            ),
            onTap: () {
              Navigator.pushNamed(context, '/account');
            },
          ),
          // ListTile(
          //   leading: Icon(Icons.settings, color: Colors.black),
          //   title: Text(
          //     'App Settings',
          //     style: TextStyle(color: Colors.black),
          //   ),
          //   onTap: () {
          //     Navigator.pushNamed(context, '/settings');
          //   },
          // ),
          ListTile(
            leading: Icon(Icons.logout, color: Colors.black),
            title: Text(
              'Logout',
              style: TextStyle(color: Colors.black),
            ),
            onTap: () async {
              await FirebaseAuth.instance.signOut();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
    );
  }
}
