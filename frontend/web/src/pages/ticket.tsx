import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import API from "../utils/Api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, Pencil1Icon, GearIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/utils/FormatDateTime";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface Ticket {
  ticket_id: number;
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

interface Comment {
  comment_id: number;
  ticket_id: number;
  user_id: number;
  description: string;
  posted_date: string;
  full_name: string;
}

function Ticket() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ticket, setTickets] = useState<Ticket[]>([]);
  const [comments, setComments] = useState<Comment[] | null>([]);
  const [newComment, setNewComment] = useState("");
  const [ticketLoading, setTicketLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const cachedTicket = localStorage.getItem(`ticket-${id}`);
    const cachedComments = localStorage.getItem(`comments-${id}`)

    if (cachedTicket && cachedComments) {
      setTickets(JSON.parse(cachedTicket));
      setComments(JSON.parse(cachedComments));
      setTicketLoading(false);
      setCommentsLoading(false);
    } else {
      fetchTickets(id);
      fetchComments(id);
    }
  }, [id]);
  

  const fetchTickets = async (id: any) => {
    try {
      const response = await API.get(`/ticket/${id}`);
      if (response.data) {
        const jsonData = await response.data;
        setTickets(jsonData);
        
        // store things in cache
        localStorage.setItem(`ticket-${id}`, JSON.stringify(jsonData));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch ticket data:", error);
    }
    setTicketLoading(false);
  };

  const fetchComments = async (id: any) => {
    try {
      const response = await API.get(`/ticket/${id}/comments`);
      if (response.data) {
        const jsonData = await response.data;
        setComments(jsonData);

        localStorage.setItem(`comments-${id}`, JSON.stringify(jsonData));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
    setCommentsLoading(false);
  };

  const handleComment = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await API.post(
          `/ticket/${id}/comments`,
          {
            description: newComment,
          }
        );
        fetchComments(id);
        setNewComment("");
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
    } else {
      alert("Comment cannot be empty!");
    }
  };

  const handleStatusChange = async (s: any, t: Ticket[]) => {
    try {
      const res = await API.put(`/ticket/${id}`, {
        ticket_id: id,
        unit_id: t[0].unit_id,
        user_id: t[0].user_id, 
        description: t[0].description,
        length: t[0].length,
        priority: t[0].priority,
        issue_area: t[0].issue_area,
        photo_url: t[0].photo_url,
        special_instructions: t[0].special_instructions,
        status: s,
      });
      t[0].status = s;
      console.log(t[0])
      setTicketLoading(true);
      await fetchTickets(id);
      localStorage.setItem(`ticket-${id}`, JSON.stringify(t));
      setTicketLoading(false);
    } catch (error) {
      console.error("Failed to change ticket status:", error);
      fetchTickets(id);
    }
  }

  const isLoading = ticketLoading || commentsLoading

  if (isLoading) {
    return <Loading />;
  }

  const badgeVariant = (status: string) => {
    return status === "active" ? "active" : "closed";
  };

  return (
    <>
    <Button className="absolute top-12" onClick={() => navigate(`/tickets`)}>
      <ArrowLeftIcon/>
    </Button>
    <div className="container mx-auto px-4 py-8">
      {ticket.map(({ ticket_id, description, unit_id, user_id, length, issue_area, photo_url, special_instructions, priority, 
      status, time_created, time_updated, queue, time_resolved, property_id }) => (
        <div key={ticket_id}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="hover:no-underline">
                <Badge className="mb-3" variant={badgeVariant(status)}>{status}</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-4">
              <DropdownMenuItem className="bg-dwellow-white-100" onClick={() => handleStatusChange("active", ticket)}>
                <Badge variant="active">active</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem  onClick={() => handleStatusChange("closed", ticket)}>
                <Badge variant="closed">closed</Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex">
            <h1 className="font-bold text-2xl">{description}</h1>
            <p className="text-dwellow-dark-100 text-xs">Ticket {ticket_id}</p>
          </div>
          <p className="text-sm text-dwellow-dark-100">Created: {formatDateTime(new Date(time_created))}</p>
          <p className="text-sm text-dwellow-dark-100">Last Updated: {formatDateTime(new Date(time_updated))}</p>
          <p className="mt-3 p-2 w-full h-24 rounded-md border bg-dwellow-white-100 border-dwellow-dark-100">{special_instructions}</p>
          <div>
            <h1 className="mt-4 font-bold text-xl">Attachments</h1>
            <p className="mt-3 p-2">Add attachments here somehow</p>
          </div>
        </div>
      ))}
      <div>
        <h1 className="mt-4 font-bold text-xl">Comments</h1>
        <div className="mt-3 p-2 w-full rounded-md border border-dwellow-dark-100 ">
          <div className="inline-flex w-full items-center">
            <Textarea
              placeholder="Type your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={250}
              rows={2}
              >
            </Textarea>
            <Button className="ml-4 mr-2" onClick={handleComment}>Comment</Button>
          </div>
          <div>
            {comments?.sort((a, b) => {
              const dateA = new Date(a.posted_date).getTime();
              const dateB = new Date(b.posted_date).getTime();
              return dateB - dateA;
              }).map(({ full_name, comment_id, ticket_id, user_id, description, posted_date }) => (
              <div key={comment_id} className="bg-dwellow-white-100 my-3 p-3 shadow-sm">
                <p className="font-semibold">{full_name}</p>
                <p className="text-sm text-dwellow-dark-100">{formatDateTime(new Date(posted_date))}</p>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Ticket;