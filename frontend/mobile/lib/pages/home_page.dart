import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:mobile/components/navigation_drawer.dart';
import 'package:mobile/models/announcement_model.dart';
import 'package:mobile/models/ticket_model.dart';
import 'package:mobile/pages/ticket_detail_page.dart';
import 'package:mobile/helper/helper_functions.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:visibility_detector/visibility_detector.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<MaintenanceTicket> tickets = [];
  final List<Announcement> notifications = [];
  bool isLoadingTickets = false;
  bool isLoadingAnnouncements = false;
  bool isFabVisible = true;
  ScrollController _scrollController = ScrollController();

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
          Uri.parse('http://api.dwellow.ca/ticket'),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );

        print('Response: ${response}');
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');

        if (response.statusCode == 200) {
          try {
            List<dynamic> data = jsonDecode(response.body);
            setState(() {
              tickets.clear();
              for (var ticket in data) {
                tickets.add(MaintenanceTicket.fromJson(ticket));
              }
              // Sort tickets with queued tickets at the top and closed items at the bottom
              tickets.sort((a, b) {
                if ((a.queue ?? 0) != 0 && (b.queue ?? 0) == 0) {
                  return -1;
                } else if ((a.queue ?? 0) == 0 && (b.queue ?? 0) != 0) {
                  return 1;
                } else if (a.status == 'closed' && b.status != 'closed') {
                  return 1;
                } else if (a.status != 'closed' && b.status == 'closed') {
                  return -1;
                } else {
                  return a.date.compareTo(b.date);
                }
              });
            });
          } catch (e) {
            print('Error decoding response: $e');
          }
        } else if (response.statusCode == 404) {
          setState(() {
            tickets.clear();
          });
          print('No tickets found');
        } else {
          print('Failed to fetch tickets: ${response.reasonPhrase}');
        }
      } else {
        print('User not authenticated');
      }
    } catch (e) {
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
          Uri.parse('http://api.dwellow.ca/announcements'),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );

        if (response.statusCode == 200) {
          List<dynamic>? data = jsonDecode(response.body);
          setState(() {
            notifications.clear();
            if (data != null) {
              for (var announcement in data) {
                notifications.add(Announcement.fromJson(announcement));
              }
            }
          });
        } else if (response.statusCode == 404) {
          setState(() {
            notifications.clear();
          });
          print('No announcements found');
        } else {
          print('Failed to fetch announcements: ${response.reasonPhrase}');
        }
      } else {
        print('User not authenticated');
      }
    } catch (e) {
      print('Error fetching announcements: $e');
    } finally {
      setState(() {
        isLoadingAnnouncements = false;
      });
    }
  }

  Future<void> _refreshData() async {
    await fetchTickets();
    await fetchAnnouncements();
  }

  void _handleVisibilityChanged(VisibilityInfo info) {
    setState(() {
      isFabVisible = info.visibleFraction == 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
      ),
      drawer: NavDrawer(),
      body: RefreshIndicator(
        color: Colors.black,
        backgroundColor: Colors.white,
        onRefresh: _refreshData,
        child: ListView(
          controller: _scrollController,
          children: [
            Container(
              width: double.infinity,
              color: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Text(
                'Announcements',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
            Container(
              color: Colors.white,
              padding: EdgeInsets.all(10),
              child: Container(
                height: 150,
                child: isLoadingAnnouncements
                    ? Center(
                        child: CircularProgressIndicator(
                        color: Colors.black,
                      ))
                    : notifications.isEmpty
                        ? Center(
                            child: Text('No announcements available',
                                style: Theme.of(context).textTheme.bodyMedium))
                        : ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: notifications.length,
                            itemBuilder: (context, index) {
                              final announcement = notifications[index];
                              return Container(
                                width: 310,
                                margin: EdgeInsets.symmetric(horizontal: 10),
                                padding: EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Theme.of(context).cardTheme.color,
                                  border:
                                      Border.all(color: Colors.grey.shade300),
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      announcement.title,
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleLarge
                                          ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                      textAlign: TextAlign.left,
                                    ),
                                    SizedBox(height: 5),
                                    Text(
                                      announcement.description,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium,
                                      textAlign: TextAlign.left,
                                    ),
                                    SizedBox(height: 5),
                                    Text(
                                      '${announcement.date.toLocal().toString().split(' ')[0]}',
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                      textAlign: TextAlign.left,
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
              ),
            ),
            Container(
              width: double.infinity,
              color: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
              child: Text(
                'Tickets',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
            Container(
              color: Colors.white,
              padding: EdgeInsets.all(10),
              child: isLoadingTickets
                  ? Center(
                      child: CircularProgressIndicator(
                      color: Colors.black,
                    ))
                  : tickets.isEmpty
                      ? Center(
                          child: Text('No tickets available',
                              style: Theme.of(context).textTheme.bodyMedium))
                      : Column(
                          children: tickets.map((ticket) {
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
                              child: Container(
                                margin: EdgeInsets.symmetric(vertical: 5),
                                padding: EdgeInsets.all(15),
                                decoration: BoxDecoration(
                                  color: Theme.of(context).cardTheme.color,
                                  border:
                                      Border.all(color: Colors.grey.shade300),
                                  borderRadius: BorderRadius.circular(5),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      ticket.issueArea.toCapitalized(),
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleLarge
                                          ?.copyWith(
                                            fontSize: 18.0,
                                            fontWeight: FontWeight.bold,
                                          ),
                                    ),
                                    SizedBox(height: 5.0),
                                    Text(
                                      ticket.description,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium
                                          ?.copyWith(
                                            fontSize: 16.0,
                                            color: Colors.black54,
                                          ),
                                    ),
                                    SizedBox(height: 5.0),
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              '${ticket.date.toLocal().toString().split(' ')[0]}',
                                              style: TextStyle(
                                                color: Colors.grey,
                                                fontSize: 12,
                                              ),
                                              textAlign: TextAlign.left,
                                            ),
                                            SizedBox(height: 5.0),
                                            Row(
                                              children: [
                                                Container(
                                                  padding: EdgeInsets.symmetric(
                                                      horizontal: 8,
                                                      vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: ticket.priority ==
                                                            'High'
                                                        ? Colors.red
                                                            .withOpacity(0.1)
                                                        : ticket.priority ==
                                                                'Medium'
                                                            ? Colors.orange
                                                                .withOpacity(
                                                                    0.1)
                                                            : Colors.green
                                                                .withOpacity(
                                                                    0.1),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            4),
                                                  ),
                                                  child: Text(
                                                    ticket.priority,
                                                    style: Theme.of(context)
                                                        .textTheme
                                                        .bodySmall
                                                        ?.copyWith(
                                                          fontSize: 14.0,
                                                          fontWeight:
                                                              FontWeight.normal,
                                                          color: ticket
                                                                      .priority ==
                                                                  'High'
                                                              ? Colors.red
                                                              : ticket.priority ==
                                                                      'Medium'
                                                                  ? Colors
                                                                      .orange
                                                                  : Colors
                                                                      .green,
                                                        ),
                                                  ),
                                                ),
                                                SizedBox(width: 5.0),
                                                Container(
                                                  padding: EdgeInsets.symmetric(
                                                      horizontal: 8,
                                                      vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: ticket.status ==
                                                            'active'
                                                        ? Colors.blue
                                                            .withOpacity(0.1)
                                                        : Colors.grey
                                                            .withOpacity(0.1),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            4),
                                                  ),
                                                  child: Text(
                                                    ticket.status,
                                                    style: Theme.of(context)
                                                        .textTheme
                                                        .bodySmall
                                                        ?.copyWith(
                                                          fontSize: 14.0,
                                                          fontWeight:
                                                              FontWeight.normal,
                                                          color:
                                                              ticket.status ==
                                                                      'active'
                                                                  ? Colors.blue
                                                                  : Colors.grey,
                                                        ),
                                                  ),
                                                ),
                                                SizedBox(width: 5.0),
                                                if (ticket.status == 'active' &&
                                                    ticket.queue != null &&
                                                    ticket.queue != 0)
                                                  Container(
                                                    padding:
                                                        EdgeInsets.symmetric(
                                                            horizontal: 8,
                                                            vertical: 2),
                                                    decoration: BoxDecoration(
                                                      color: Colors.purple
                                                          .withOpacity(0.1),
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              4),
                                                    ),
                                                    child: Text(
                                                      'Queue: ${ticket.queue}',
                                                      style: Theme.of(context)
                                                          .textTheme
                                                          .bodySmall
                                                          ?.copyWith(
                                                            fontSize: 14.0,
                                                            fontWeight:
                                                                FontWeight
                                                                    .normal,
                                                            color:
                                                                Colors.purple,
                                                          ),
                                                    ),
                                                  ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
            ),
            VisibilityDetector(
              key: Key('bottom-of-list'),
              onVisibilityChanged: _handleVisibilityChanged,
              child: SizedBox(height: 1), // Invisible widget at the bottom
            ),
          ],
        ),
      ),
      floatingActionButton: AnimatedOpacity(
        opacity: isFabVisible ? 1.0 : 0.0,
        duration: Duration(milliseconds: 200),
        child: FloatingActionButton.extended(
          onPressed: () {
            Navigator.pushNamed(context, '/chat');
          },
          backgroundColor: Color(0xFF1C1C22),
          icon: Icon(Icons.chat, color: Colors.white),
          label: Text(
            'Chat with Kiwi',
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}
