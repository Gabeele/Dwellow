import { useState, useEffect } from "react";
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
  unit: string;
  user_id: number;
  description: string;
  length: string;
  priority: string;
  issue_area: string;
  photo_url: string;
  special_instructions: string;
  status: string;
  time_created: string;
  time_updated: string;
  queue: number | null;
  time_resolved: string | null;
  property_id: number;
  property_title: string;
  tenant_name: string;
}

export const fetchTickets = async () => {
  try {
    const response = await API.get("/ticket");
    if (response.status === 200) {
      const jsonData = await response.data;
      if (jsonData.success && Array.isArray(jsonData.data)) {
        const formattedTickets = jsonData.data.map((ticket: any) => ({
          id: ticket.ticket_id,
          unit: ticket.unit,
          user_id: ticket.user_id,
          description: ticket.description,
          length: ticket.length,
          priority: ticket.priority,
          issue_area: ticket.issue_area,
          photo_url: ticket.photo_url,
          special_instructions: ticket.special_instructions,
          status: ticket.status,
          time_created: ticket.time_created,
          time_updated: ticket.time_updated,
          queue: ticket.queue,
          time_resolved: ticket.time_resolved,
          property_id: ticket.property_id,
          property_title: ticket.property_title,
          tenant_name: ticket.tenant_name,
        }));

        const pendingTickets = formattedTickets.filter(
          (ticket: { status: string }) => ticket.status === "pending"
        );

        const closedTickets = formattedTickets.filter(
          (ticket: { status: string }) => ticket.status === "closed"
        );

        const queuedTickets = formattedTickets.filter(
          (ticket: { status: string; queue: number | null }) =>
            ticket.status === "active" && ticket.queue !== null
        );

        // Sort queuedTickets by queue number
        queuedTickets.sort((a: Ticket, b: Ticket) => {
          return (a.queue ?? 0) - (b.queue ?? 0);
        });

        return {
          allTickets: formattedTickets,
          pendingTickets,
          closedTickets,
          queuedTickets,
        };
      } else {
        console.error("No tickets found or invalid data structure");
        return {
          allTickets: [],
          pendingTickets: [],
          closedTickets: [],
          queuedTickets: [],
        };
      }
    } else {
      console.error("Failed to fetch tickets, status code:", response.status);
      return {
        allTickets: [],
        pendingTickets: [],
        closedTickets: [],
        queuedTickets: [],
      };
    }
  } catch (error: any) {
    console.error("Failed to fetch tickets:", error.message);
    return {
      allTickets: [],
      pendingTickets: [],
      closedTickets: [],
      queuedTickets: [],
    };
  }
};

function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [closedTickets, setClosedTickets] = useState<Ticket[]>([]);
  const [queuedTickets, setQueuedTickets] = useState<Ticket[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [maxQueue, setMaxQueue] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaxQueue();
    fetchTickets().then(
      ({ allTickets, pendingTickets, closedTickets, queuedTickets }) => {
        setTickets(allTickets);
        setPendingTickets(pendingTickets);
        setClosedTickets(closedTickets);
        setQueuedTickets(queuedTickets);
        setLoading(false);
      }
    );
  }, []);

  const fetchMaxQueue = async () => {
    try {
      const response = await API.get("/ticket/max-queue");
      if (response.status === 200) {
        const jsonData = response.data;
        const resolvedData = await jsonData;
        if ((resolvedData as any).max !== undefined) {
          setMaxQueue(resolvedData.max);
        } else {
          console.error("Invalid data structure for max queue");
        }
      } else {
        console.error(
          "Failed to fetch max queue, status code:",
          response.status
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch max queue:", error.message);
    }
  };

  useEffect(() => {
    fetchProperties().then(setProperties);
  }, []);

  const handleUpdate = () => {
    fetchTickets().then(
      ({ allTickets, pendingTickets, closedTickets, queuedTickets }) => {
        setTickets(allTickets);
        setPendingTickets(pendingTickets);
        setClosedTickets(closedTickets);
        setQueuedTickets(queuedTickets);
      }
    );

    fetchMaxQueue();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <CreateTicketDialog
          properties={properties}
          onTicketCreated={handleUpdate}
        />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {queuedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              {...ticket}
              maxQueue={maxQueue}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pendingTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              {...ticket}
              maxQueue={maxQueue}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Closed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {closedTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              {...ticket}
              maxQueue={maxQueue}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tickets;
