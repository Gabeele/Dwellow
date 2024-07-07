import 'package:flutter/material.dart';
import 'package:mobile/models/ticket_model.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:mobile/helper/helper_functions.dart'; // import extension file
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart'; // for date formatting

class TicketDetailPage extends StatefulWidget {
  final MaintenanceTicket ticket;

  TicketDetailPage({required this.ticket});

  @override
  _TicketDetailPageState createState() => _TicketDetailPageState();
}

class _TicketDetailPageState extends State<TicketDetailPage> {
  List<Comment> comments = [];
  bool isLoading = false;
  final TextEditingController _commentController = TextEditingController();
  User? currentUser;

  @override
  void initState() {
    super.initState();
    fetchTicketDetails();
    currentUser = FirebaseAuth.instance.currentUser;
  }

  Future<void> fetchTicketDetails() async {
    setState(() {
      isLoading = true;
    });
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        String? token = await user.getIdToken();

        final response = await http.get(
          Uri.parse('https://api.dwellow.ca/ticket/${widget.ticket.ticketId}'),
          headers: {
            'Authorization': 'bearer $token',
          },
        );

        if (response.statusCode == 200) {
          var data = jsonDecode(response.body);
          setState(() {
            comments = (data['comments'] as List)
                .map((comment) => Comment.fromJson(comment))
                .toList();
          });
        } else {
          print('Failed to fetch ticket details: ${response.reasonPhrase}');
        }
      }
    } catch (e) {
      print('Error fetching ticket details: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> addComment(String commentText) async {
    setState(() {
      isLoading = true;
    });
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        String? token = await user.getIdToken();

        final response = await http.post(
          Uri.parse(
              'https://api.dwellow.ca/ticket/${widget.ticket.ticketId}/comment'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'description': commentText,
            'user_id': user.uid,
          }),
        );

        if (response.statusCode == 201) {
          fetchTicketDetails();
        } else {
          print('Failed to add comment: ${response.reasonPhrase}');
        }
      }
    } catch (e) {
      print('Error adding comment: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  String formatDate(DateTime date) {
    return DateFormat('MMMM d, y').format(date);
  }

  @override
  Widget build(BuildContext context) {
    String reporter = 'Added by you';

    return Scaffold(
      appBar: AppBar(
        title: Text('Details'),
      ),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: isLoading
                  ? Center(child: CircularProgressIndicator())
                  : Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  widget.ticket.issueArea.toCapitalized(),
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              SizedBox(width: 10),
                              Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: widget.ticket.priority == 'High'
                                      ? Colors.red.withOpacity(0.1)
                                      : widget.ticket.priority == 'Medium'
                                          ? Colors.orange.withOpacity(0.1)
                                          : Colors.green.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  widget.ticket.priority,
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: widget.ticket.priority == 'High'
                                        ? Colors.red
                                        : widget.ticket.priority == 'Medium'
                                            ? Colors.orange
                                            : Colors.green,
                                  ),
                                ),
                              ),
                              SizedBox(width: 10),
                              Text(
                                '#${widget.ticket.ticketId}',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black54,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Text(
                            '$reporter on ${formatDate(widget.ticket.date)}',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black54,
                            ),
                          ),
                          SizedBox(height: 16),
                          Text(
                            widget.ticket.description,
                            style: TextStyle(fontSize: 16),
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Comments',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 8),
                          Expanded(
                            child: ListView.builder(
                              itemCount: comments.length,
                              itemBuilder: (context, index) {
                                final comment = comments[index];
                                return ListTile(
                                  title: Text(comment.text),
                                  subtitle: Text('User ID: ${comment.userId}'),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 40,
                      child: TextField(
                        controller: _commentController,
                        decoration: InputDecoration(
                          labelText: 'Write a comment...',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      if (_commentController.text.isNotEmpty) {
                        addComment(_commentController.text);
                        _commentController.clear();
                      }
                    },
                    child: Text('Submit'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: Size(100, 40), // Set the size of the button
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class Comment {
  final int commentId;
  final int ticketId;
  final int userId;
  final String text;

  Comment({
    required this.commentId,
    required this.ticketId,
    required this.userId,
    required this.text,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      commentId: json['comment_id'],
      ticketId: json['ticket_id'],
      userId: json['user_id'],
      text: json['text'],
    );
  }
}
