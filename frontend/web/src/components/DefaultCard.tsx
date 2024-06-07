import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

function DefaultCard(){
    const nav = useNavigate();
    const handleOnClick = () => nav("/properties");
    return(
        <Card className="w-56 h-48 rounded-lg hover:bg-dwellow-white-200 hover:cursor-pointer" onClick={handleOnClick}>
            <CardHeader className="p-4">
                <CardTitle>Property Name</CardTitle>
            </CardHeader>
            <CardContent className="px-5">
                <img src="apartment-building.jpg" className="rounded-sm"/>
            </CardContent>
        </Card>
    );
}

export default DefaultCard;