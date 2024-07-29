import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DefaultTicketProps {
  id: number;
  description: string;
  special_instructions: string;
  time_created: string;
  status: string;
}

function truncateText(text:string, maxLength:number) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + ' [...]';
  }
  
function DefaultTicket({ id, description, special_instructions, time_created, status, }: DefaultTicketProps) {
  const nav = useNavigate();
  const handleOnClick = () => nav(`/tickets/${id}`);

  const truncatedDescription = truncateText(description, 60);

  const badgeVariant = status === "active" ? "active" : "closed";

  return (
    <Card className="flex flex-col w-full h-[100px] rounded-lg hover:bg-dwellow-white-200 hover:cursor-pointer" onClick={handleOnClick}>
      <CardHeader className="p-4 pt-2">
        <div className="inline-flex w-full">
          <CardTitle className="text-lg">{truncatedDescription}</CardTitle>
          <Badge variant={badgeVariant} className="ml-auto mr-0">{status}</Badge>
        </div>
        <CardDescription>{time_created}</CardDescription>
        <CardDescription>{special_instructions}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default DefaultTicket;
