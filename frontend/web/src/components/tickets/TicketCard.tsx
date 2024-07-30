import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "../..//utils/FormatDateTime";

interface TicketCardProps {
  id: number;
  description: string;
  unit_id: number;
  status: string;
  time_created: string;
  special_instructions: string;
  issue_area: string;
  property_id: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  description,
  unit_id,
  status,
  time_created,
  special_instructions,
  issue_area,
  property_id,
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
          {truncateText(description, 25)}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {formatDateTime(new Date(time_created))}
        </p>
        <p className="text-sm mb-2">{special_instructions}</p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{property_id}</span>
          <span>Unit {unit_id}</span>
        </div>
      </Card>
    </Link>
  );
};

export default TicketCard;
