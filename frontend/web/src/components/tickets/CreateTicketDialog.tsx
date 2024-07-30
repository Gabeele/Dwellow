import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CharacterCount from "@/components/CharacterCount";
import API from "@/utils/Api";
import { PlusIcon } from "lucide-react";

interface Property {
  id: number;
  title: string;
}

interface Unit {
  id: number;
  unit: string;
}

interface CreateTicketDialogProps {
  properties: Property[];
  onTicketCreated: () => void;
}

const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({
  properties,
  onTicketCreated,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState("");
  const [newTicketLength, setNewTicketLength] = useState("");
  const [newTicketIssueArea, setNewTicketIssueArea] = useState("");
  const [newTicketPhotoURL, setNewTicketPhotoURL] = useState("");

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
        localStorage.setItem(
          `units-${id}`,
          JSON.stringify(jsonData.units || [])
        );
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch unit data:", error);
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find((p) => p.id.toString() === propertyId);
    if (property) {
      setSelectedProperty(property.title);
      setSelectedPropertyId(property.id);
      setSelectedUnit(null);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const res = await API.get("/account");
      if (res.status === 200) {
        const jsonData = await res.data;
        const userId = jsonData[0].user_id;
        console.log(`User ID: ${userId}`);
        const response = await API.post(`/ticket`, {
          unit_id: selectedUnit,
          user_id: userId,
          description: newTicketTitle,
          length: newTicketLength,
          priority: newTicketPriority,
          issue_area: newTicketIssueArea,
          photo_url: newTicketPhotoURL,
          special_instructions: newTicketDesc,
          property_id: selectedPropertyId,
        });
        console.log("Ticket created successfully:", response);
        onTicketCreated();
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
    setDialogOpen(false);
  };

  useEffect(() => {
    if (!dialogOpen) {
      setSelectedProperty("");
      setSelectedPropertyId(null);
      setSelectedUnit(null);
      setNewTicketTitle("");
      setNewTicketDesc("");
      setNewTicketPriority("");
      setNewTicketLength("");
    }
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
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
                <CharacterCount
                  currentCount={newTicketDesc.length}
                  maxCount={250}
                />
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
                    <SelectItem
                      key={property.id}
                      value={property.id.toString()}
                    >
                      {property.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="no-properties"
                    value="no-properties"
                    disabled
                  >
                    No Properties Available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedProperty && (
              <Select
                onValueChange={(value) => setSelectedUnit(parseInt(value, 10))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Unit">
                    {selectedUnit
                      ? units.find((unit) => unit.id === selectedUnit)?.unit
                      : "Select Unit"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {units.length > 0 ? (
                    units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
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
            <Select
              value={newTicketPriority}
              onValueChange={(e) => setNewTicketPriority(e)}
            >
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
              <CharacterCount
                currentCount={newTicketLength.length}
                maxCount={25}
              />
            </div>
            <p className="text-base font-semibold mt-2 mb-1">Issue Area</p>
            <Select
              value={newTicketIssueArea}
              onValueChange={(e) => setNewTicketIssueArea(e)}
            >
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
  );
};

export default CreateTicketDialog;
