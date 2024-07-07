import 'package:flutter/material.dart';

class ChatPage extends StatefulWidget {
  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  bool _isSending = false;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    // Simulate loading messages
    Future.delayed(Duration(seconds: 2), () {
      setState(() {
        _isLoading = false;
      });
    });
  }

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isNotEmpty && !_isSending) {
      setState(() {
        _messages.add({'type': 'sent', 'content': text});
        _controller.clear();
        _isSending = true;
      });

      // Simulate a response
      Future.delayed(Duration(seconds: 2), () {
        setState(() {
          _messages.add({'type': 'received', 'content': 'Response to: $text'});
          _isSending = false;
        });
      });
    }
  }

  Widget _buildMessage(Map<String, String> message) {
    bool isSent = message['type'] == 'sent';
    return Align(
      alignment: isSent ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 5, horizontal: 8),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSent ? Color(0xFF1C1C22) : Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          message['content']!,
          style: TextStyle(
            color: isSent ? Colors.white : Colors.black,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chatbot Chat'),
      ),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : ListView.builder(
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
                  Expanded(
                    child: Container(
                      height: 40, // Set the height of the input box
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          hintText: 'Type your message...',
                          contentPadding: EdgeInsets.symmetric(horizontal: 10),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _isSending ? null : _sendMessage,
                    child: Text('Send'),
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Color(0xFF1C1C22),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      minimumSize: Size(70, 40), // Set the size of the button
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
