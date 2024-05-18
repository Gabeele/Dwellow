import 'package:flutter/material.dart';

class ChatPage extends StatefulWidget {
  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  bool _isSending = false;

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isNotEmpty && !_isSending) {
      setState(() {
        _messages.add({'type': 'text', 'content': text});
        _controller.clear();
        _isSending = true;
      });

      // Simulate a response
      Future.delayed(Duration(seconds: 2), () {
        setState(() {
          _messages.add({'type': 'text', 'content': 'Response to: $text'});
          _isSending = false;
        });
      });
    }
  }

  void _uploadPhoto() {
    // Simulate photo upload
    setState(() {
      _messages.add({'type': 'photo', 'content': 'Photo URL'});
    });
  }

  Widget _buildMessage(Map<String, String> message) {
    if (message['type'] == 'text') {
      return ListTile(
        title: Text(message['content']!),
      );
    } else if (message['type'] == 'photo') {
      return ListTile(
        title: Image.network(message['content']!),
      );
    } else {
      return Container();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Robot Chat'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return _buildMessage(_messages[index]);
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(Icons.photo),
                  onPressed: _uploadPhoto,
                ),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Enter a message',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: _isSending ? null : _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
