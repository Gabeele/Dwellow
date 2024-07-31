import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/Api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/utils/FormatDateTime";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/Loading";

interface Ticket {
  ticket_id: number;
  description: string;
  unit_id: number;
  unit: string;
  user_id: number;
  created_by: string;
  tenant_name: string;
  length: string;
  issue_area: string;
  photo_url: string;
  special_instructions: string;
  priority: string;
  status: string;
  time_created: string;
  time_updated: string;
  queue: number | null;
  time_resolved: string | null;
  property_id: number;
  property_title: string;
}

interface Comment {
  comment_id: number;
  ticket_id: number;
  user_id: number;
  description: string;
  posted_date: string;
  full_name: string;
}

export default function Component() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[] | null>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTicket(id);
    fetchComments(id);
    setLoading(false);
  }, [id]);

  const fetchTicket = async (id: any) => {
    try {
      const response = await API.get(`/ticket/${id}`);
      const ticketData = await response.data;
      setTicket(ticketData.length > 0 ? ticketData[0] : null);
    } catch (error) {
      console.error("Failed to fetch ticket data:", error);
    }
  };

  const fetchComments = async (id: any) => {
    try {
      const response = await API.get(`/ticket/${id}/comments`);
      setComments(await response.data);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  const handleComment = async () => {
    if (newComment.trim() !== "") {
      try {
        await API.post(`/ticket/${id}/comments`, {
          description: newComment,
        });
        fetchComments(id);
        setNewComment("");
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
    } else {
      alert("Comment cannot be empty!");
    }
  };

  const updateTicketQueue = async (newQueue: number) => {
    try {
      const response = await API.post(`/ticket/${id}/queue`, {
        new_queue: newQueue,
      });
      if (response.status === 201) {
        fetchTicket(id);
      } else {
        console.error("Failed to update ticket queue:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket queue:", error);
    }
  };

  const handleClose = async () => {
    updateTicketQueue(0);
  };

  const badgeClass = useMemo(() => {
    switch (ticket?.status) {
      case "pending":
        return "bg-yellow-300";
      case "closed":
        return "bg-red-300";
      case "active":
        return "bg-green-300";
      default:
        return "bg-gray-300";
    }
  }, [ticket?.status]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate(`/tickets`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Badge className={`px-2 py-1 text-md font-medium ${badgeClass}`}>
            {ticket?.status}
          </Badge>
          <Badge className="px-2 py-1 text-md font-medium">
            {ticket?.priority}
          </Badge>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={ticket?.status === "closed"}
          >
            Close Ticket
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {ticket?.description}{" "}
          <span className="text-md text-muted-foreground">
            #{ticket?.ticket_id}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Created: {formatDateTime(new Date(ticket?.time_created || ""))}
        </p>
        <p className="text-sm text-muted-foreground">
          Last Updated: {formatDateTime(new Date(ticket?.time_updated || ""))}
        </p>
        <p className="text-sm text-muted-foreground">
          Property: {ticket?.property_title}
        </p>
        <p className="text-sm text-muted-foreground">Unit: {ticket?.unit}</p>
        <p className="text-sm text-muted-foreground">
          Tenant: {ticket?.tenant_name}
        </p>
        <p className="text-sm text-muted-foreground">
          Created by: {ticket?.created_by}
        </p>
        {ticket?.time_resolved && (
          <p className="text-sm text-muted-foreground">
            Resolved: {formatDateTime(new Date(ticket?.time_resolved))}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <p className="text-muted-foreground">{ticket?.description}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructions">Special Instructions</Label>
          <p className="text-muted-foreground">
            {ticket?.special_instructions}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="length">Length of Incident</Label>
          <p className="text-muted-foreground">{ticket?.length}</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-bold">Comments</h2>
        <div className="flex items-center mt-2">
          <Textarea
            placeholder="Type your comment..."
            className="flex-1 mr-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleComment}>Comment</Button>
        </div>
        <div className="mt-4 space-y-2">
          {comments
            ?.sort(
              (a, b) =>
                new Date(b.posted_date).getTime() -
                new Date(a.posted_date).getTime()
            )
            .map(({ comment_id, full_name, posted_date, description }) => (
              <div key={comment_id} className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold">{full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(new Date(posted_date))}
                </p>
                <p>{description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
