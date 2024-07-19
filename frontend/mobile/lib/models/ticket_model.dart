class MaintenanceTicket {
  final String ticketId;
  final String issueArea;
  final String description;
  final DateTime date;
  final String priority;
  final String status;
  final int queue;

  MaintenanceTicket({
    required this.ticketId,
    required this.issueArea,
    required this.description,
    required this.date,
    required this.priority,
    required this.status,
    required this.queue,
  });

  factory MaintenanceTicket.fromJson(Map<String, dynamic> json) {
    return MaintenanceTicket(
      ticketId: json['ticket_id'].toString(),
      issueArea: json['issue_area'] ?? '',
      description: json['description'] ?? '',
      date: json['time_created'] != null
          ? DateTime.parse(json['time_created'])
          : DateTime.now(),
      priority: json['priority'] ?? 'Low',
      status: json['status'] ?? 'active',
      queue: json['queue'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ticket_id': ticketId,
      'issue_area': issueArea,
      'description': description,
      'date': date.toIso8601String(),
      'priority': priority,
      'status': status,
      'queue': queue,
    };
  }
}
