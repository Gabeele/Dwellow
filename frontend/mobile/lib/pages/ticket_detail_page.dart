import 'package:flutter/material.dart';
import 'package:mobile/models/ticket_model.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

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

  @override
  void initState() {
    super.initState();
    fetchTicketDetails();
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
          Uri.parse('https://api.dwellow.ca/ticket/${widget.ticket.ticket_id}'),
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
              'https://api.dwellow.ca/ticket/${widget.ticket.ticket_id}/comment'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'comment': commentText,
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Ticket Details'),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.ticket.title,
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Description:',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    widget.ticket.description,
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Priority: ${widget.ticket.priority}',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: widget.ticket.priority == 'High'
                          ? Colors.red
                          : Colors.black,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Comments:',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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
                  TextField(
                    controller: _commentController,
                    decoration: InputDecoration(
                      labelText: 'Add a comment',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () {
                      if (_commentController.text.isNotEmpty) {
                        addComment(_commentController.text);
                        _commentController.clear();
                      }
                    },
                    child: Text('Add Comment'),
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
