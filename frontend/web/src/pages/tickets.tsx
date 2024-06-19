import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { fetchProperties } from "./properties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import API from "@/utils/Api";

interface Property {
  id: number;
  title: string;
  address: string;
  description: string;
}

interface Unit {
  id: number;
  unit: string;
  property_id: number;
  description: string;
  email: string;
  full_name: string;
  phone_number: string;
}

interface Ticket {
  id: number;
  description: string;
  unit_id: number;
  user_id: number;
  length: string;
  issue_area: string;
  photo_url: string;
  special_instructions: string;
  priority: string;
}

function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  useEffect(() => {
    const cachedTickets = localStorage.getItem("tickets");
    if (cachedTickets) {
      setProperties(JSON.parse(cachedTickets));
    } else {
      fetchTickets();
    }
  }, []);

  useEffect(() => {
    const cachedProperties = localStorage.getItem("properties");
    if (cachedProperties) {
      setProperties(JSON.parse(cachedProperties));
    } else {
      fetchProperties().then(setProperties);
    }
  }, []);

  useEffect(() => {
    if (selectedPropertyId !== null) {
      const cachedUnits = localStorage.getItem(`units-${selectedPropertyId}`);
      if (cachedUnits) {
        setUnits(JSON.parse(cachedUnits));
      } else {
        fetchUnits(selectedPropertyId);
      }
    } else {
      setUnits([]);
    }
  }, [selectedPropertyId]);

  const fetchUnits = async (id: number) => {
    try {
      const response = await API.get(`/properties/${id}/units`);
      if (response.data) {
        const jsonData = await response.data;
        setUnits(jsonData.units || []);
        localStorage.setItem(`units-${id}`, JSON.stringify(jsonData.units || []));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch unit data:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await API.get("/tickets");
      if (response.status === 200) {
        const jsonData = await response.data;
        if (jsonData.success && Array.isArray(jsonData.data)) {
          const formattedTickets = jsonData.data.map((tickets: any) => ({
            id: tickets.id,
          }));
          localStorage.setItem("tickets", JSON.stringify(formattedTickets));
          return formattedTickets;
        } else {
          console.error("No tickets found or invalid data structure");
          return [];
        }
      } else {
        console.error("Failed to fetch tickets, status code:", response.status);
        return [];
      }
    } catch (error: any) {
      console.error("Failed to fetch tickets:", error.message);
      return [];
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id.toString() === propertyId);
    if (property) {
      console.log(property.id)
      setSelectedProperty(property.title);
      setSelectedPropertyId(property.id);
      setSelectedUnit("");
      console.log(selectedPropertyId)
    }
  };

  return (
    <div className="">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dwellow-dark-200">Tickets</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <PlusIcon />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Ticket</DialogTitle>
              <DialogDescription>Manually create a ticket.</DialogDescription>
            </DialogHeader>

            <Input
              placeholder="Ticket Title"
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}/>
            <p className="text-base font-semibold">Add Attachments</p>
            <Input type="file"/>

            <Select onValueChange={handlePropertyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent>
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="no-properties" value="no-properties" disabled>
                    No Properties Available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedProperty && (
              <Select onValueChange={setSelectedUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit">
                    {selectedUnit || "Select Unit"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {units.length > 0 ? (
                    units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.unit}>
                        {unit.unit}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-units" value="no-units" disabled>
                      No Units Available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}

            <DialogFooter>
              <Button>Create</Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 pl-0 gap-4 p-4">
          {tickets.map(({ id, description, unit_id, user_id, length, issue_area, photo_url, special_instructions, priority }) => (
            <Card>
              <CardHeader>
                <CardTitle>{description}</CardTitle>
                  <CardDescription>{special_instructions}</CardDescription>
                </CardHeader>
              <CardContent>
                <p className="mt-4">{issue_area} Units</p>
              </CardContent>
              <CardFooter>{unit_id}</CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Tickets;
