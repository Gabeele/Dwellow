import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../utils/Api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
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
import { CopyIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

interface Property {
  id: number;
  title: string;
  address: string;
  pDescription: string;
}

interface Unit {
  unit_id: number;
  unit: string;
  property_id: number;
  description: string;
}

function Property() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    unit: "",
    description: "",
  });

  useEffect(() => {
    API.get(`/properties/${id}/units`)
      .then((response) => {
        console.log(response);
        const propertyData: Property = response.recordset[0];
        const unitsData: Unit[] = response.recordsets[0];
        setProperty(propertyData);
        setUnits(unitsData);
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, [id]);

  const handleAddUnit = () => {
    setIsDrawerOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving unit:", newUnit); // Log newUnit before sending
    API.post(`/properties/${id}/units`, newUnit)
      .then((response) => {
        console.log("Unit saved successfully:", response);
        // Refresh units data after adding a new unit
        API.get(`/properties/${id}/units`)
          .then((response) => {
            const unitsData: Unit[] = response.recordsets[0];
            setUnits(unitsData);
          })
          .catch((error: Error) => {
            console.error(error);
          });
        setIsDrawerOpen(false);
        setNewUnit({});
      })
      .catch((error) => {
        console.error("Error saving unit:", error);
      });
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUnit((prevUnit) => ({
      ...prevUnit,
      [name]: value,
    }));
  };

  const handleSendInvite = async () => {
    if (!email || !selectedUnit) {
      alert("Please provide both an email address and a unit.");
      return;
    }

    const unitId = units.find((unit) => unit.unit === selectedUnit)?.unit_id;
    if (!unitId) {
      alert("Invalid unit selected.");
      return;
    }

    try {
      const response = await API.post(
        `/properties/${id}/units/${unitId}/invite`,
        { email }
      );
      console.log("Invite sent successfully:", response);
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  return (
    <>
      {property && (
        <div>
          <h2>{property.title}</h2>
          <p>{property.address}</p>
          <p>{property.pDescription}</p>
        </div>
      )}
      <Button onClick={handleAddUnit}>
        <PlusIcon className="" />
        Add New Unit
      </Button>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Unit</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <form onSubmit={handleSaveUnit}>
            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Unit:
                </label>
                <Input
                  id="unit"
                  name="unit"
                  type="text"
                  placeholder="Enter unit"
                  value={newUnit.unit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description:
                </label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Enter description"
                  value={newUnit.description}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="mr-2">
                Save
              </Button>
              <Button variant="outline" onClick={closeDrawer}>
                Cancel
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
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
          <Input
            placeholder="Tenant's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select onValueChange={setSelectedUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.unit_id} value={unit.unit}>
                  {unit.unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleSendInvite}>Send Invite</Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.unit_id}>
              <TableCell>{unit.unit}</TableCell>
              <TableCell>{unit.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Property;
