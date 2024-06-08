import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

interface DefaultCardProps {
  id: string;
  title: string;
  address: string;
  units: number;
  photo: string;
  description: string;
}

function DefaultCard({ id, title, address, units, photo, description }: DefaultCardProps) {
  const nav = useNavigate();
  const handleOnClick = () => nav(`/property/${id}`);

  return (
    <Card className="w-56 h-full rounded-lg hover:bg-dwellow-white-200 hover:cursor-pointer" onClick={handleOnClick}>
      <CardHeader className="p-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{address}</CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <img src={photo} className="rounded-sm" alt={`Property ${id}`} />
      </CardContent>
    </Card>
  );
}

export default DefaultCard;