import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "../../utils/FormatDateTime";
import API from "@/utils/Api";

interface TicketCardProps {
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
  maxQueue: number;
  onUpdate: () => void; // Callback to update the parent component
}

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  unit,
  user_id,
  description,
  length,
  priority,
  issue_area,
  photo_url,
  special_instructions,
  status,
  time_created,
  time_updated,
  queue,
  time_resolved,
  property_id,
  property_title,
  tenant_name,
  maxQueue,
  onUpdate,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const badgeClass = useMemo(() => {
    switch (status) {
      case "pending":
        return "bg-yellow-300";
      case "closed":
        return "bg-red-300";
      case "active":
        return "bg-green-300";
      default:
        return "bg-gray-300";
    }
  }, [status]);

  const updateTicketStatus = async (newStatus: string) => {
    try {
      let response;
      if (newStatus === "active" && status === "pending") {
        response = await API.put(`/ticket/status/${id}`, {
          status: newStatus,
        });
        if (response.status === 200) {
          await updateTicketQueue(maxQueue + 1);
        }
      } else if (newStatus === "closed") {
        response = await API.put(`/ticket/status/${id}`, {
          status: newStatus,
          time_resolved: new Date().toISOString(),
        });
        if (response.status === 200) {
          await updateTicketQueue(0);
        }
      } else {
        response = await API.put(`/ticket/status/${id}`, {
          status: newStatus,
          queue: null,
        });
      }

      if (response.status === 200) {
        onUpdate(); // Callback to refresh tickets in the parent component
      } else {
        console.error("Failed to update ticket status:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const updateTicketQueue = async (newQueue: number) => {
    try {
      const response = await API.post(`/ticket/${id}/queue`, {
        new_queue: newQueue,
      });
      if (response.status === 201) {
        onUpdate(); // Callback to refresh tickets in the parent component
      } else {
        console.error("Failed to update ticket queue:", response.status);
      }
    } catch (error) {
      console.error("Error updating ticket queue:", error);
    }
  };

  const handleMoveUp = () => {
    if (queue && queue > 1) {
      updateTicketQueue(queue - 1);
    }
  };

  const handleMoveDown = () => {
    if (queue) {
      updateTicketQueue(queue + 1);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link to={`/ticket/${id}`} className="w-full">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
              <Badge className={badgeClass}>{status}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {truncateText(description, 25)}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {formatDateTime(new Date(time_created))}
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{property_title}</span>
              <span>Unit {unit}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Tenant: {tenant_name}</span>
            </div>
            {queue !== null && (
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                <span>
                  Queue Position: {queue}/{maxQueue}
                </span>
              </div>
            )}
          </Card>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {status === "pending" && (
          <>
            <ContextMenuItem
              onClick={async () => {
                updateTicketQueue(maxQueue + 1);
              }}
            >
              Add to Queue
            </ContextMenuItem>
            <ContextMenuItem onClick={() => updateTicketStatus("closed")}>
              Set as Closed
            </ContextMenuItem>
          </>
        )}

        {status === "active" && (
          <>
            <ContextMenuItem onClick={handleMoveUp}>Move Up</ContextMenuItem>
            <ContextMenuItem onClick={handleMoveDown}>
              Move Down
            </ContextMenuItem>
            <ContextMenuItem onClick={() => updateTicketStatus("closed")}>
              Set as Closed
            </ContextMenuItem>
          </>
        )}

        {status === "closed" && (
          <>
            <ContextMenuItem onClick={() => updateTicketStatus("pending")}>
              Reopen as Pending
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TicketCard;
