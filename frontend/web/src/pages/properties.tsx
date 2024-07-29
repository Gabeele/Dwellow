// Properties.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/Api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import Loading from "@/components/Loading";

interface Property {
  id: number;
  title: string;
  address: string;
  units: number;
  description: string;
  photo: string;
}

export const fetchProperties = async () => {
  try {
    const response = await API.get("/properties");
    if (response.status === 200) {
      const jsonData = await response.data;
      if (jsonData.success && Array.isArray(jsonData.data)) {
        const formattedProperties = jsonData.data.map((property: any) => ({
          id: property.id,
          title: property.title,
          address: property.address,
          units: property.unit_count || 0,
          description: property.description || "No description provided",
          photo: property.photo || "apartment-building.jpg",
        }));
        // Cache properties
        localStorage.setItem("properties", JSON.stringify(formattedProperties));
        return formattedProperties;
      } else {
        console.error("No properties found or invalid data structure");
        return [];
      }
    } else {
      console.error("Failed to fetch properties, status code:", response.status);
      return [];
    }
  } catch (error: any) {
    console.error("Failed to fetch properties:", error.message);
    return [];
  }
};

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: "",
    address: "",
    units: 0,
    photo: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const clearCache = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const cachedProperties = localStorage.getItem("properties");
    if (cachedProperties) {
      setProperties(JSON.parse(cachedProperties));
      setLoading(false);
    } else {
      fetchProperties().then((data) => {
        setProperties(data);
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      setNewProperty({
        title: "",
        address: "",
        units: 0,
        photo: "",
        description: "",
      });
    }
  }, [isDialogOpen]);

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    API.post("/properties", newProperty)
      .then((response) => {
        console.log("Property saved successfully:", response);
        clearCache();
        fetchProperties().then(setProperties);
        setIsDialogOpen(false);
        setNewProperty({});
      })
      .catch((error) => {
        console.error("Error saving property:", error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value,
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dwellow-dark-200">Properties</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <PlusIcon />
              Add New Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="text-sm font-semibold mb-1">Property Name</p>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter title"
                maxLength={50}
                value={newProperty.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Address</p>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter address"
                maxLength={50}
                value={newProperty.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Description</p>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Enter description"
                maxLength={100}
                value={newProperty.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Upload Photo</p>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Number of Units</p>
              <Input
                id="units"
                name="units"
                type="number"
                placeholder="Enter number of units"
                value={newProperty.units}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSaveProperty}>Save</Button>
              <DialogClose asChild onClick={() => setIsDialogOpen(false)}>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 pl-0 gap-4 p-4">
          {properties.map(({ id, title, address, units, photo, description }) => (
            <Link key={id} to={`/property/${id}`} className="max-w-xs">
              <Card>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img className="w-full" src={photo} alt={`Property ${id}`} />
                  <p className="mt-4">{units} Units</p>
                </CardContent>
                <CardFooter>{description}</CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export default Properties;
