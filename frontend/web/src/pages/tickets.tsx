import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/Loading";
import CreateTicketDialog from "@/components/tickets/CreateTicketDialog";
import TicketCard from "@/components/tickets/TicketCard";
import API from "@/utils/Api";
import { fetchProperties } from "./properties";

interface Property {
  id: number;
  title: string;
  address: string;
  description: string;
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
  property_id: string;
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
          property_id: ticket.property_id || `0000`,
        }));
        localStorage.setItem("tickets", JSON.stringify(formattedTickets));
        const activeTickets = formattedTickets.filter(
          (ticket: { status: string }) => ticket.status === "active"
        );
        localStorage.setItem("active-tickets", JSON.stringify(activeTickets));

        const closedTickets = formattedTickets.filter(
          (ticket: { status: string }) => ticket.status === "closed"
        );
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <CreateTicketDialog
          properties={properties}
          onTicketCreated={() =>
            fetchTickets().then(
              ({ allTickets, activeTickets, closedTickets }) => {
                setTickets(allTickets);
                setActiveTickets(activeTickets);
                setClosedTickets(closedTickets);
              }
            )
          }
        />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Queue</h2>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Open Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeTickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Closed Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {closedTickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tickets;
