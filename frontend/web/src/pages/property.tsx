import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../utils/Api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Loading from "@/components/Loading";
import { Textarea } from "@/components/ui/textarea";
import CharacterCount from "@/components/CharacterCount";

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

interface Announcement{
  id: number;
  user_id: number;
  announcement_date: string;
  title: string;
  text: string;
  property_id: number;
}

function Property() {
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property| null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [email, setEmail] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    unit: "",
    description: "",
  });
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementDesc, setNewAnnouncementDesc] = useState("");
  const [alertTitle, setAlertTitle] = useState("Default");
  const [alertDescription, setAlertDescription] = useState("Description");
  const [showAlert, setShowAlert] = useState(false); // use for later

  const [loadingProperty, setLoadingProperty] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

   const fetchData = async (id: any) => {
    try {
      const response = await API.get(`/properties/${id}/units`);
      if (response.status === 200) {
        const jsonData = await response.data;
        console.log("Property data:", jsonData);
        setProperty(jsonData.property);
        setUnits(jsonData.units || []);
        localStorage.setItem(`property-${id}`, JSON.stringify(jsonData.property));
        localStorage.setItem(`units-${id}`, JSON.stringify(jsonData.units || []));
        setLoadingUnits(false);
      } else {
        console.error("Failed to fetch property and/or unit data, status code:", response.status);
        if (response.status === 401) {
          setTimeout(() => fetchData(id), 2000);
        }
      }
    } catch (error) {
      console.error("Failed to fetch property data:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await API.get(`/announcements/property/${id}`);
      if (response.status === 200) {
        const jsonData = await response.data;
        if (jsonData.success && Array.isArray(jsonData.data)) {
          const formattedAnnouncements = jsonData.data.map((announcement: any) => ({
            id: announcement.announcement_id,
            user_id: announcement.user_id,
            announcement_date: announcement.announcement_date,
            title: announcement.title,
            text: announcement.text,
            property_id: announcement.property_id
          }));
          console.log("Announcement data:", jsonData.data);
          setAnnouncements(formattedAnnouncements);
          localStorage.setItem(`announcements-${id}`, JSON.stringify(formattedAnnouncements));
          setLoadingAnnouncements(false);
        } else if (jsonData.data === null) {
          setAnnouncements(null);
          localStorage.setItem(`announcements-${id}`, JSON.stringify(null));
          setLoadingAnnouncements(false);
        }
      } else {
        console.error("Failed to fetch announcement data, status code:", response.status);
        if (response.status === 401) {
          setTimeout(fetchAnnouncements, 2000);
        }
      }
    } catch (error) {
      console.error("Failed to fetch announcement data:", error);
    }
  };

  useEffect(() => {
    const cachedProperty = localStorage.getItem(`property-${id}`);
    const cachedUnits = localStorage.getItem(`units-${id}`);
    const cachedAnnouncements = localStorage.getItem(`announcements-${id}`);

    if (cachedProperty && cachedUnits && cachedAnnouncements) {
      setProperty(JSON.parse(cachedProperty));
      setUnits(JSON.parse(cachedUnits));
      setAnnouncements(JSON.parse(cachedAnnouncements));
      
      setLoadingUnits(false);
      setLoadingAnnouncements(false);
    } else {
      const fetchAllData = async () => {
        await fetchData(id);
        await fetchAnnouncements();
      };
      fetchAllData();
    }
  }, [id]);

  // sets values to default or null if any dialog gets closed
  useEffect(() => {
    if (!isUnitDialogOpen) {
      setNewUnit({
        unit: "",
        description: "",
      })
    }
    if (!isInviteDialogOpen) {
      setEmail("");
      setSelectedUnit("");
    }
    if(!isAnnouncementDialogOpen) {
      setNewAnnouncementTitle("");
      setNewAnnouncementDesc("");
    }
  }, [isUnitDialogOpen, isInviteDialogOpen, isAnnouncementDialogOpen]);

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving unit:", newUnit); // Log newUnit before sending

    try {
      // Post new unit data to the server
      const postResponse = await API.post(`/properties/${id}/units`, newUnit);
      console.log("Unit saved successfully:", postResponse);

      // Refresh unit list after successful post
      fetchData(id);
      setIsUnitDialogOpen(false);
      setNewUnit({});
    } catch (error) {
      console.error("Error during save or refresh units:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUnit((prevUnit) => ({
      ...prevUnit,
      [name]: value,
    }));
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setNewUnit(unit);
  };

  const handleCancelEdit = () => {
    setEditingUnitId(null);
    setNewUnit({
      unit: "",
      description: "",
    });
  };

  const handleSaveEditedUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Editing unit:", newUnit);

    try {
      // Update unit data on the server
      const putResponse = await API.put(`/properties/${id}/units/${editingUnitId}`, newUnit);
      console.log("Unit updated successfully:", putResponse);

      // Refresh unit list after successful update
      fetchData(id);
      setEditingUnitId(null);
      setNewUnit({});
    } catch (error) {
      console.error("Error during update or refresh units:", error);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    try {
      // Delete unit data on the server
      const deleteResponse = await API.delete(`/properties/${id}/units/${unitId}`);
      console.log("Unit deleted successfully:", deleteResponse);

      // Refresh unit list after successful delete
      fetchData(id);
    } catch (error) {
      console.error("Error during delete or refresh units:", error);
    }
  };

  const handleSendInvite = async () => {
    if (!email || !selectedUnit) {
      alert("Please provide both an email address and a unit.");
      return;
    }

    const unitId = units.find((unit) => unit.unit === selectedUnit)?.id;
    if (!unitId) {
      alert("Invalid unit selected.");
      return;
    }
    console.log("Sending invite to:", email, "for unit:", unitId);
    console.log(unitId);
    try {
      const response = await API.post(
        `/invitation`,
        { email, unitId, id }
      );
      console.log("Invite sent successfully:", response);
      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  const handleSaveAnnouncement = async () => {
    if (!newAnnouncementTitle || !newAnnouncementDesc) {
      alert("Please provide a title and description.");
      return;
    }
    try {
      const response = await API.post(
        `/announcements`,
        { title: newAnnouncementTitle, 
          text: newAnnouncementDesc, 
          property_id: id }
      );
      console.log(`Announcement for property ${id} created successfully:`, response);
      setIsAnnouncementDialogOpen(false);

      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to create announcement:", error);
      alert("Error creating announcement. Please try again later.");
      return;
    }
  }

  const handleDeleteAnnouncement = async (announcementId: number) => {
    try {
      const response = await API.delete(`/announcements/${announcementId}`);
      console.log(`Announcement ${announcementId} deleted successfully:`, response);
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  useEffect(() => {
    if (!loadingUnits && !loadingAnnouncements) {
      setLoadingProperty(false);
    }
  }, [loadingUnits, loadingAnnouncements]);

  const isLoading = loadingProperty || loadingUnits || loadingAnnouncements;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center">
        {property && (
          <div>
            <p className="font-bold text-xl">{property.title}</p>
            <p>{property.address}</p>
            <p>{property.description}</p>
          </div>
        )}
        { showAlert ? 
          <Alert>
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{alertDescription}</AlertDescription>
          </Alert>
          : null 
        }
      </div>
      <div className="my-4">
        <h1 className="text-xl font-bold text-dwellow-dark-200">Announcements</h1>
        <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAnnouncementDialogOpen(true)} className="my-5">
              <PlusIcon />
                Add Announcement
              </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Announcement</DialogTitle>
              <DialogDescription>
                Make an announcement for {property?.title}
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="text-sm font-semibold mb-1">Title</p>
              <Input
                id="announcementTitle"
                type="text"
                placeholder="Enter title"
                maxLength={50}
                value={newAnnouncementTitle}
                onChange={(e) => setNewAnnouncementTitle(e.target.value)}
              />
              <div className="relative bottom-2">
                <CharacterCount currentCount={newAnnouncementTitle.length} maxCount={50} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Unit Description</p>
              <Textarea
                className="resize-none"
                id="announcementDesc"
                placeholder="Enter description"
                maxLength={250}
                rows={6}
                value={newAnnouncementDesc}
                onChange={(e) => setNewAnnouncementDesc(e.target.value)}
              />
              <div className="relative bottom-2">
                <CharacterCount currentCount={newAnnouncementDesc.length} maxCount={250} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveAnnouncement}>Save</Button>
              <DialogClose asChild onClick={() => setIsAnnouncementDialogOpen(false)}>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        <div className="flex flex-col bg-dwellow-white-0 px-4 rounded-lg">
          {announcements !== null ? (
            <div>
              {announcements.slice(0, 5).map(({ id, title, announcement_date, text, property_id }) => (
                <div key={id} className="my-2 p-2 border-b">
                  <div className="relative">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <Button className="absolute right-0" variant={"destructive"} onClick={() => handleDeleteAnnouncement(id)}>
                      Delete
                    </Button>
                  </div>
                  <p className="text-sm text-dwellow-dark-100">{new Date(announcement_date).toLocaleString()}</p>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            ) : (
              <p className="py-10 pl-4">No announcements available</p>
            )}
        </div>
      </div>
      <h1 className="text-xl font-bold text-dwellow-dark-200">Units</h1>
      <div className="my-5 space-x-5">
        <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsUnitDialogOpen(true)}>
              <PlusIcon />
              Add New Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit</DialogTitle>
              <DialogDescription>
                Enter unit number and a description for the unit.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="text-sm font-semibold mb-1">Unit Number</p>
              <Input
                id="unit"
                name="unit"
                type="text"
                placeholder="Enter unit"
                value={newUnit.unit || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Unit Description</p>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Enter description"
                value={newUnit.description || ""}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveUnit}>Save</Button>
              <DialogClose asChild onClick={() => setIsUnitDialogOpen(false)}>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <PlusIcon />
              Invite a Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a Tenant</DialogTitle>
              <DialogDescription>
                Enter the tenant's email and select the unit to send the invite.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="text-sm font-semibold mb-1">Tenant Email</p>
              <Input
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Unit Number</p>
              <Select onValueChange={setSelectedUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
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
                    No units available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleSendInvite}>Send Invite</Button>
              <DialogClose asChild>
                <Button variant="secondary" onClick={() => setIsInviteDialogOpen(false)}>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.length > 0 ? (
            units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="w-1/6 text-wrap">
                  {editingUnitId === unit.id ? (
                    <Input
                      id="unit"
                      name="unit"
                      type="text"
                      value={newUnit.unit || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    unit.unit
                  )}
                </TableCell>
                <TableCell className="w-1/4 text-wrap">
                  {editingUnitId === unit.id ? (
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      value={newUnit.description || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    unit.description
                  )}
                </TableCell>
                <TableCell className="text-wrap">{unit.full_name}</TableCell>
                <TableCell className="text-wrap">{unit.email}</TableCell>
                <TableCell className="text-wrap">{unit.phone_number}</TableCell>
                <TableCell className="flex space-x-4">
                  {editingUnitId === unit.id ? (
                    <>
                      <Button className="mr-[7.4px]" onClick={handleSaveEditedUnit}>
                        Save
                      </Button>
                      <Button variant={"outline"} onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEditUnit(unit)}>
                        <Pencil1Icon />
                        Edit
                      </Button>
                      <Button variant={"destructive"} onClick={() => handleDeleteUnit(unit.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No units available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </>
  );
}

export default Property;
