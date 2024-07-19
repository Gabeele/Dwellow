import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/rendering.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';

class ChatPage extends StatefulWidget {
  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage>
    with SingleTickerProviderStateMixin {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];
  final ScrollController _scrollController = ScrollController();
  bool _isSending = false;
  bool _isLoading = true;
  late WebSocketChannel _channel;
  bool _isConnected = false;
  bool _hasError = false;
  bool _showTypingIndicator = false;
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _connectToWebSocket();
    _scrollController.addListener(() {
      if (_scrollController.position.userScrollDirection !=
          ScrollDirection.idle) {
        FocusScope.of(context).unfocus();
      }
    });
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1000),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _disconnectWebSocket();
    _scrollController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _disconnectWebSocket() {
    if (_channel != null) {
      _channel.sink.close();
    }
  }

  Future<void> _connectToWebSocket() async {
    User? user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      String? token = await user.getIdToken();

      final headers = {
        'Authorization': 'Bearer $token',
      };

      _channel = IOWebSocketChannel.connect(
        Uri.parse('wss://chat.dwellow.ca'),
        headers: headers,
      );

      _channel.stream.listen((message) {
        if (!_isConnected) {
          if (message == 'ACK') {
            _channel.sink.add('connected');
          } else if (message == 'connected') {
            setState(() {
              _isConnected = true;
              _isLoading = false;
            });
          }
        } else {
          setState(() {
            _showTypingIndicator = false;
            _messages.add({'type': 'received', 'content': message});
            _isSending = false;
            _scrollToBottom();
          });
        }
      }, onError: (error) {
        print('WebSocket error: $error');
        setState(() {
          _hasError = true;
          _isLoading = false;
        });
      });
    } else {
      // Handle user not signed in
      print('User not signed in');
    }
  }

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isNotEmpty && !_isSending) {
      setState(() {
        _messages.add({'type': 'sent', 'content': text});
        _showTypingIndicator = true;
        _controller.clear();
        _isSending = true;
        _scrollToBottom();
      });

      _channel.sink.add(text);
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Kiwi Chat'),
      ),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                Expanded(
                  child: _hasError
                      ? Center(
                          child:
                              Text('Connection error. Please try again later.'))
                      : ListView.builder(
                          controller: _scrollController,
                          itemCount:
                              _messages.length + (_showTypingIndicator ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (_showTypingIndicator &&
                                index == _messages.length) {
                              return _buildTypingIndicator();
                            }
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
                              contentPadding:
                                  EdgeInsets.symmetric(horizontal: 10),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            enabled: !_isLoading,
                          ),
                        ),
                      ),
                      SizedBox(width: 8),
                      ElevatedButton(
                        onPressed:
                            _isSending || _isLoading ? null : _sendMessage,
                        child: Text('Send'),
                        style: ElevatedButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor: Color(0xFF1C1C22),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                            side: BorderSide(
                              color: Color(0xFF1C1C22),
                            ),
                          ),
                          minimumSize:
                              Size(70, 40), // Set the size of the button
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (_isLoading)
              Center(
                child: Container(
                  color: Colors.white.withOpacity(0.8),
                  child: CircularProgressIndicator(),
                ),
              ),
          ],
        ),
      ),
    );
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

  Widget _buildTypingIndicator() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 5, horizontal: 8),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildDot(0),
            SizedBox(width: 5),
            _buildDot(1),
            SizedBox(width: 5),
            _buildDot(2),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(int index) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Opacity(
          opacity: (index == 0
                  ? _animationController.value
                  : (index == 1
                      ? (_animationController.value > 0.5
                          ? _animationController.value - 0.5
                          : _animationController.value + 0.5)
                      : 1.0 - _animationController.value))
              .clamp(0.0, 1.0),
          child: child,
        );
      },
      child: CircleAvatar(
        radius: 5,
        backgroundColor: Colors.grey[600],
      ),
    );
  }
}
