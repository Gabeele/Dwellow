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

function Property() {
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [email, setEmail] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    unit: "",
    description: "",
  });
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);

  useEffect(() => {
    const cachedProperty = localStorage.getItem(`property-${id}`);
    const cachedUnits = localStorage.getItem(`units-${id}`);

    console.log(cachedUnits)

    if (cachedProperty && cachedUnits) {
      setProperty(JSON.parse(cachedProperty));
      setUnits(JSON.parse(cachedUnits));
    } else {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id: any) => {
    try {
      const response = await API.get(`/properties/${id}/units`);
      if (response.data) {
        const jsonData = await response.data;
        console.log("Property data:", jsonData);
        setProperty(jsonData.property);
        setUnits(jsonData.units || []);

        localStorage.setItem(`property-${id}`, JSON.stringify(jsonData.property));
        localStorage.setItem(`units-${id}`, JSON.stringify(jsonData.units || []));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch property data:", error);
    }
  };

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

  return (
    <>
      {property && (
        <div>
          <p className="font-bold text-xl">{property.title}</p>
          <p>{property.address}</p>
          <p>{property.description}</p>
        </div>
      )}
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
                <TableCell>
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
                <TableCell>
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
                <TableCell>{unit.full_name}</TableCell>
                <TableCell>{unit.email}</TableCell>
                <TableCell>{unit.phone_number}</TableCell>
                <TableCell className="flex space-x-4">
                  {editingUnitId === unit.id ? (
                    <Button onClick={handleSaveEditedUnit}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEditUnit(unit)}>
                      <Pencil1Icon />
                      Edit
                    </Button>
                  )}
                  <Button variant={"destructive"} onClick={() => handleDeleteUnit(unit.id)}>
                    Delete
                  </Button>
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
    </>
  );
}

export default Property;
