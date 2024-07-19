class Announcement {
  final String title;
  final String description;
  final DateTime date;

  Announcement({
    required this.title,
    required this.description,
    required this.date,
  });

  factory Announcement.fromJson(Map<String, dynamic> json) {
    return Announcement(
      title: json['title'] as String,
      description: json['text'] as String,
      date: DateTime.parse(json['announcement_date']),
    );
  }
}
