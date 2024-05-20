import 'package:flutter/material.dart';
import 'package:mobile/components/navigation_drawer.dart';
import 'package:mobile/models/ticket_model.dart';
import 'package:mobile/pages/chat_page.dart';

class HomePage extends StatelessWidget {
  final List<MaintenanceTicket> tickets = [
    MaintenanceTicket(
      title: 'Leaky Faucet',
      description: 'The faucet in the kitchen is leaking.',
      date: DateTime.now().subtract(Duration(days: 1)),
    ),
    MaintenanceTicket(
      title: 'Broken Light',
      description: 'The light in the living room is broken.',
      date: DateTime.now().subtract(Duration(days: 2)),
    ),
    // Add more tickets here
  ];

  final List<String> notifications = [
    'Reminder: Pay your rent by the 5th',
    'Maintenance scheduled for 21st',
    'Community meeting on 28th',
    'Pool closed for cleaning on 14th',
    // Add more notifications here
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      drawer: NavDrawer(),
      body: Column(
        children: [
          Container(
            height: 100, // Adjust the height as needed
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                return Container(
                  width: 200, // Adjust the width as needed
                  margin: EdgeInsets.symmetric(horizontal: 10, vertical: 20),
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Center(
                    child: Text(
                      notifications[index],
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: tickets.length,
              itemBuilder: (context, index) {
                final ticket = tickets[index];
                return Card(
                  margin: EdgeInsets.all(10.0),
                  child: Padding(
                    padding: const EdgeInsets.all(15.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          ticket.title,
                          style: TextStyle(
                            fontSize: 20.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 10.0),
                        Text(
                          ticket.description,
                          style: TextStyle(
                            fontSize: 16.0,
                          ),
                        ),
                        SizedBox(height: 10.0),
                        Text(
                          'Date: ${ticket.date.toLocal()}'.split(' ')[0],
                          style: TextStyle(
                            fontSize: 14.0,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/chat');
        },
        child: Icon(Icons.chat),
        tooltip: 'Chat',
      ),
    );
  }
}
