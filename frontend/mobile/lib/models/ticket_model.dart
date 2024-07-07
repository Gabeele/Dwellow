// ticket_model.dart
class MaintenanceTicket {
  final String ticketId;
  final String issueArea;
  final String description;
  final DateTime date;
  final String priority;

  MaintenanceTicket({
    required this.ticketId,
    required this.issueArea,
    required this.description,
    required this.date,
    required this.priority,
  });

  factory MaintenanceTicket.fromJson(Map<String, dynamic> json) {
    return MaintenanceTicket(
      ticketId: json['ticket_id']
          .toString(), // Ensure ticket_id is treated as a string
      issueArea: json['issue_area'] ?? '',
      description: json['description'] ?? '',
      date:
          json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
      priority: json['priority'] ?? 'Low',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ticket_id': ticketId,
      'issue_area': issueArea,
      'description': description,
      'date': date.toIso8601String(),
      'priority': priority,
    };
  }
}
