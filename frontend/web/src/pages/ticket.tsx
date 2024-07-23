import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../utils/Api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";

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
}

function Ticket() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTickets] = useState<Ticket[]>([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedTicket = localStorage.getItem(`ticket-${id}`);
    console.log(cachedTicket)
    if (cachedTicket) {
      setTickets(JSON.parse(cachedTicket));
      //setLoading(false);
    } else {
      fetchData(id);
    }
  }, [id]);


  const fetchData = async (id: any) => {
    try {
      const response = await API.get(`/ticket/${id}`);
      if (response.data) {
        const jsonData = await response.data;
        console.log("Ticket data:", jsonData);
        setTickets(jsonData);
        // store things in cache
        localStorage.setItem(`ticket-${id}`, JSON.stringify(jsonData));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch ticket data:", error);
    }
    //setLoading(false);
  };

  //if (loading) {
    //return <Loading />;
  //}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="my-5 space-x-5"></div>
      {ticket.map((ticket) => (
        <p>{ticket.description}</p>
      ))}

    </div>
  );
}

export default Ticket;
