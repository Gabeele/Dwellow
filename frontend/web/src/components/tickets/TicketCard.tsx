import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "../../utils/FormatDateTime";

interface TicketCardProps {
  id: number;
  description: string;
  unit: string;
  status: string;
  time_created: string;
  special_instructions: string;
  issue_area: string;
  property_title: string;
  tenant_name: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  description,
  unit,
  status,
  time_created,
  special_instructions,
  issue_area,
  property_title,
  tenant_name,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const badgeVariant = (status: string) => {
    return status === "active" ? "active" : "closed";
  };

  return (
    <Link to={`/ticket/${id}`} className="w-full">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant={badgeVariant(status)}>{status}</Badge>
        </div>
        <h3 className="text-lg font-semibold mb-1">
          {sentenceCaseText(truncateText(description, 25))}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {formatDateTime(new Date(time_created))}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{property_title}</span>
          <span>Unit {unit}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Tenant: {tenant_name}</span>
        </div>
      </Card>
    </Link>
  );
};

export default TicketCard;

const sentenceCaseText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
