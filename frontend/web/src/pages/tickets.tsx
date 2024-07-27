import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import API from "@/utils/Api";
import CharacterCount from "@/components/CharacterCount";
import Loading from "@/components/Loading";
import { formatDateTime } from '../utils/FormatDateTime';

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
  status: string;
  time_created: string;
  time_updated: string;
  queue: number;
  time_resolved: string;
  property_id: number;
}

export const fetchTickets = async () => {
  try {
    const response = await API.get("/ticket");
    if (response.status === 200) {
      const jsonData = await response.data;
      if (jsonData.success && Array.isArray(jsonData.data)) {
        const formattedTickets = jsonData.data.map((ticket: any) => ({
          id: ticket.ticket_id,
          description: ticket.description,
          unit_id: ticket.unit_id,
          user_id: ticket.user_id,
          length: ticket.length,
          issue_area: ticket.issue_area,
          photo_url: ticket.photo_url,
          special_instructions: ticket.special_instructions,
          priority: ticket.priority,
          status: ticket.status,
          time_created: ticket.time_created,
          time_updated: ticket.time_updated,
          queue: ticket.queue,
          time_resolved: ticket.time_resolved,
          property_id: ticket.property_id || `0000`
        }));
        localStorage.setItem("tickets", JSON.stringify(formattedTickets));
        const activeTickets = formattedTickets.filter((ticket: { status: string; }) => ticket.status === "active");
        localStorage.setItem("active-tickets", JSON.stringify(activeTickets));

        const closedTickets = formattedTickets.filter((ticket: { status: string; }) => ticket.status === "closed");
        localStorage.setItem("closed-tickets", JSON.stringify(closedTickets));

        return { allTickets: formattedTickets, activeTickets, closedTickets };
      } else {
        console.error("No tickets found or invalid data structure");
        return { allTickets: [], activeTickets: [], closedTickets: [] };
      }
    } else {
      console.error("Failed to fetch tickets, status code:", response.status);
      return { allTickets: [], activeTickets: [], closedTickets: [] };
    }
  } catch (error: any) {
    console.error("Failed to fetch tickets:", error.message);
    return { allTickets: [], activeTickets: [], closedTickets: [] };
  }
};

function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [closedTickets, setClosedTickets] = useState<Ticket[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  let [userId] = useState("");

  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [newTicketPriority, setNewTicketPriority] = useState("");
  const [newTicketLength, setNewTicketLength] = useState("");
  const [newTicketIssueArea, setNewTicketIssueArea] = useState("");
  const [newTicketPhotoURL, setNewTicketPhotoURL] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedTickets = localStorage.getItem("tickets");
    const cachedActiveTickets = localStorage.getItem("active-tickets");
    const cachedClosedTickets = localStorage.getItem("closed-tickets");

    if (cachedTickets && cachedActiveTickets && cachedClosedTickets) {
      setTickets(JSON.parse(cachedTickets));
      setActiveTickets(JSON.parse(cachedActiveTickets));
      setClosedTickets(JSON.parse(cachedClosedTickets));
      setLoading(false);
    } else {
      fetchTickets().then(({ allTickets, activeTickets, closedTickets }) => {
        setTickets(allTickets);
        setActiveTickets(activeTickets);
        setClosedTickets(closedTickets);
        setLoading(false);
      });
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

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id.toString() === propertyId);
    if (property) {
      setSelectedProperty(property.title);
      setSelectedPropertyId(property.id);
      setSelectedUnit("");
    }
  };

  const handleCreateTicket = async () => {
    try {
      const res = await API.get("/account");
      if (res.status === 200) {
        const jsonData = await res.data;
        if (jsonData != null) {
          userId = jsonData[0].user_id;
          console.log(`User ID: ${userId}`);
        }
      }

      const response = await API.post(
        `/ticket`,
        { unit_id: selectedUnit, user_id: userId, description: newTicketTitle, length: newTicketLength, priority: newTicketPriority, 
          issue_area: newTicketIssueArea, photo_url: newTicketPhotoURL, special_instructions: newTicketDesc, queue: 0, property_id: selectedPropertyId }
      );
      console.log("Ticket created successfully:", response);
      fetchTickets().then(({ allTickets, activeTickets, closedTickets }) => {
        setTickets(allTickets);
        setActiveTickets(activeTickets);
        setClosedTickets(closedTickets);
      });
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  useEffect(() => {
    if (!dialogOpen) {
      setSelectedProperty("");
      setSelectedPropertyId(null);
      setSelectedUnit("");
      setNewTicketTitle("");
      setNewTicketDesc("");
      setNewTicketPriority("");
      setNewTicketLength("");
    }
  }, [dialogOpen]);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + ' [...]';
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dwellow-dark-200">Tickets</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <PlusIcon />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Create Ticket</DialogTitle>
              <DialogDescription>Manually create a ticket.</DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Input
                placeholder="Ticket Title"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                maxLength={50}
              />
              <CharacterCount currentCount={newTicketTitle.length} maxCount={50} />
            </div>

            <div className="grid grid-cols-3 gap-x-4">
              <div className="col-span-2">
                <p className="text-base font-semibold mb-2">Ticket Description</p>
                <div className="relative">
                  <textarea
                    className="w-full h-[225px] p-2 border text-sm rounded-md resize-none
                    shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Ticket Description"
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    maxLength={250}
                    rows={5}
                  />
                  <div className="relative bottom-2">
                    <CharacterCount currentCount={newTicketDesc.length} maxCount={250} />
                  </div>
                  <p className="text-base font-semibold mb-1">Add Attachments</p>
                  <Input type="file" />
                </div>
              </div>

              <div className="col-span-1">
                <p className="text-base font-semibold mb-1">Property</p>
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
                    <SelectTrigger className="mt-2">
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
                <p className="text-base font-semibold mt-2 mb-1">Ticket Priority</p>
                <Select value={newTicketPriority} onValueChange={(e) => setNewTicketPriority(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-base font-semibold mt-2 mb-1">Ticket Length</p>
                <div className="relative">
                  <Input
                  className="text-sm"
                  placeholder="Ex. 2 Days"
                  value={newTicketLength}
                  onChange={(e) => setNewTicketLength(e.target.value)}
                  maxLength={25}
                  />
                  <CharacterCount currentCount={newTicketLength.length} maxCount={25} />
                </div>
                <p className="text-base font-semibold mt-2 mb-1">Issue Area</p>
                <Select value={newTicketIssueArea} onValueChange={(e) => setNewTicketIssueArea(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Issue Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="AC/Heating">AC/Heating</SelectItem>
                    <SelectItem value="Structure">Structure</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Parking">Parking</SelectItem>
                    <SelectItem value="Amenities">Amenities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreateTicket}>Create</Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <h1 className="text-xl font-bold text-dwellow-dark-200 mt-4">Open Tickets</h1>
        <div className="flex flex-col bg-dwellow-white-0 mt-4 p-4 rounded-lg">
          {activeTickets.length === 0 ? (
            <div className="flex items-center justify-center h-[230px] text-center text-gray-500">
              <p>No active tickets</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 pl-0 gap-4 p-4">
              {activeTickets.map(({ id, description, unit_id, user_id, length, issue_area, photo_url, special_instructions, 
                priority, status, time_created, time_updated, queue, time_resolved, property_id }) => (
                <Link key={id} to={`/ticket/${id}`} className="w-full">
                  <Card className="relative h-[230px]" key={id}>
                    <CardDescription className="absolute left-3 top-3">{issue_area}</CardDescription>
                    <Badge className="absolute top-3 right-3">{status}</Badge>
                    <CardHeader className="mt-6">
                      <CardTitle>{truncateText(description, 25)}</CardTitle>
                      <CardDescription>{formatDateTime(new Date(time_created))}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 -mt-4">{truncateText(special_instructions, 25)}</p>
                    </CardContent>
                    <div className="absolute bottom-8 w-full border-t-2">
                      <CardDescription className="absolute left-3 mt-1">{property_id}</CardDescription>
                      <CardDescription className="absolute right-3 mt-1">Unit {unit_id}</CardDescription>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold text-dwellow-dark-200 mt-4">Closed Tickets</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 pl-0 gap-4 p-4">
          {closedTickets.map(({ id, description, unit_id, user_id, length, issue_area, photo_url, special_instructions, 
            priority, status, time_created, time_updated, queue, time_resolved, property_id }) => (
            <Link key={id} to={`/ticket/${id}`} className="w-full">
              <Card className="relative h-[230px]" key={id}>
                <CardDescription className="absolute left-3 top-3">{issue_area}</CardDescription>
                <Badge className="absolute top-3 right-3">{status}</Badge>
                <CardHeader className="mt-6">
                  <CardTitle>{truncateText(description, 25)}</CardTitle>
                  <CardDescription>{formatDateTime(new Date(time_created))}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 -mt-4">{truncateText(special_instructions, 25)}</p>
                </CardContent>
                <div className="absolute bottom-8 w-full border-t-2">
                  <CardDescription className="absolute left-3 mt-1">{property_id}</CardDescription>
                  <CardDescription className="absolute right-3 mt-1">Unit {unit_id}</CardDescription>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export default Tickets;
