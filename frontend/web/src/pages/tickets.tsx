import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

function Tickets(){
    return(
        <div className="">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-dwellow-dark-200">Tickets</h1>
                <Button className="mt-4"><PlusIcon/>Create Ticket</Button>
            </main>
        </div>
    );
}

export default Tickets;