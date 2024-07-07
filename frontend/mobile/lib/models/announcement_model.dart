class Announcement {
  final String title;
  final String description;
  final String date;

  Announcement({
    required this.title,
    required this.description,
    required this.date,
  });

  factory Announcement.fromJson(Map<String, dynamic> json) {
    return Announcement(
      title: json['title'],
      description: json['description'],
      date: json['date'],
    );
  }
}
