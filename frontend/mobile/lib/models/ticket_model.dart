class MaintenanceTicket {
  final int ticket_id;
  final String title;
  final String description;
  final String? priority;

  MaintenanceTicket({
    required this.ticket_id,
    required this.title,
    required this.description,
    this.priority,
  });
}
