import { useNavigate } from "react-router-dom";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"

function DefaultTicket(){
    const nav = useNavigate();
    const handleOnClick = () => nav("/tickets");
    return(
        <Card className="flex flex-col w-[485px] h-[100px] rounded-lg hover:bg-dwellow-white-200 hover:cursor-pointer" onClick={handleOnClick}>
            <CardHeader className="p-4 pt-2">
                <div className="inline-flex">
                    <CardTitle className="text-lg">Ticket Name</CardTitle>
                    <Badge variant="default" className="ml-auto mr-0">In Progress</Badge>
                </div>
                <CardDescription>June 7, 2024</CardDescription>
                <CardDescription>Ticket description</CardDescription>
            </CardHeader>
        </Card>
    );
}

export default DefaultTicket;