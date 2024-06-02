import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:mobile/components/navigation_drawer.dart';
import 'package:mobile/models/announcement_model.dart';
import 'package:mobile/models/ticket_model.dart';
import 'package:mobile/pages/chat_page.dart';
import 'package:mobile/pages/ticket_detail_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<MaintenanceTicket> tickets = [];
  final List<Announcement> notifications = [];
  bool isLoadingTickets = false;
  bool isLoadingAnnouncements = false;

  @override
  void initState() {
    super.initState();
    fetchTickets();
    fetchAnnouncements();
  }

  Future<void> fetchTickets() async {
    setState(() {
      isLoadingTickets = true;
    });
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        String? token = await user.getIdToken();

        final response = await http.get(
          Uri.parse('https://api.dwellow.ca/ticket'),
          headers: {
            'Authorization': 'bearer $token',
          },
        );

        print("Response status: ${response.statusCode}");
        print("Response body: ${response.body}");

        if (response.statusCode == 200) {
          List<dynamic> data = jsonDecode(response.body);
          setState(() {
            tickets.clear();
            for (var ticket in data) {
              tickets.add(MaintenanceTicket(
                ticket_id: ticket['ticket_id'],
                title: ticket['issue_area'],
                description: ticket['description'],
                priority: ticket['priority'],
                // date: DateTime.parse(ticket['date']),
              ));
            }
          });
          print("Tickets fetched: ${tickets.length}");
        } else {
          // Handle the error
          print('Failed to fetch tickets: ${response.reasonPhrase}');
        }
      } else {
        print('User not authenticated');
      }
    } catch (e) {
      // Handle the error
      print('Error fetching tickets: $e');
    } finally {
      setState(() {
        isLoadingTickets = false;
      });
    }
  }

  Future<void> fetchAnnouncements() async {
    setState(() {
      isLoadingAnnouncements = true;
    });
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        String? token = await user.getIdToken();

        final response = await http.get(
          Uri.parse('https://api.dwellow.ca/announcements'),
          headers: {
            'Authorization': 'bearer $token',
          },
        );

        print("Response status: ${response.statusCode}");
        print("Response body: ${response.body}");

        if (response.statusCode == 200) {
          List<dynamic> data = jsonDecode(response.body);
          setState(() {
            notifications.clear();
            for (var announcement in data) {
              notifications.add(Announcement(
                title: announcement['title'],
                description: announcement['description'],
                date: announcement['date'], // assuming date is a string
              ));
            }
          });
          print("Announcements fetched: ${notifications.length}");
        } else {
          // Handle the error
          print('Failed to fetch announcements: ${response.reasonPhrase}');
        }
      } else {
        print('User not authenticated');
      }
    } catch (e) {
      // Handle the error
      print('Error fetching announcements: $e');
    } finally {
      setState(() {
        isLoadingAnnouncements = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home Page'),
      ),
      drawer: NavDrawer(),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              'Recent Announcements',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          Container(
            height: 100,
            child: isLoadingAnnouncements
                ? Center(child: CircularProgressIndicator())
                : notifications.isEmpty
                    ? Center(child: Text('No announcements available'))
                    : ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: notifications.length,
                        itemBuilder: (context, index) {
                          final announcement = notifications[index];
                          return Container(
                            width: 200,
                            margin: EdgeInsets.symmetric(
                                horizontal: 10, vertical: 20),
                            padding: EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Theme.of(context)
                                  .primaryColor
                                  .withOpacity(0.1),
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: Center(
                              child: Text(
                                announcement.title,
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
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              'Recent Tickets',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: isLoadingTickets
                ? Center(child: CircularProgressIndicator())
                : tickets.isEmpty
                    ? Center(child: Text('No tickets available'))
                    : ListView.builder(
                        itemCount: tickets.length,
                        itemBuilder: (context, index) {
                          final ticket = tickets[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      TicketDetailPage(ticket: ticket),
                                ),
                              );
                            },
                            child: Card(
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
                                      'Priority: ${ticket.priority}',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.bold,
                                        color: ticket.priority == 'High'
                                            ? Colors.red
                                            : Colors.black,
                                      ),
                                    ),
                                    // Uncomment the following line if the date field is added back
                                    // SizedBox(height: 10.0),
                                    // Text(
                                    //   'Date: ${ticket.date.toLocal()}'.split(' ')[0],
                                    //   style: TextStyle(
                                    //     fontSize: 14.0,
                                    //     fontStyle: FontStyle.italic,
                                    //   ),
                                    // ),
                                  ],
                                ),
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
