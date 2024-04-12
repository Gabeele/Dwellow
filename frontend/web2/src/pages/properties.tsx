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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";

interface Property {
  id: number;
  title: string;
  address: string;
  units: number;
  description: string;
  photo: string;
}

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: "",
    address: "",
    units: 0,
    photo: "",
    description: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    API.get("/properties")
      .then((response) => {
        const propertiesData: Property[] = response.map((property: any) => ({
          id: property.id,
          title: property.title,
          address: property.address,
          units: property.unit_count || 0,
          description: property.description,
          photo: property.photo || "apartment-building.jpg",
        }));

        if (propertiesData.length > 0) {
          setProperties(propertiesData);
        } else {
          console.error("No properties found");
          setProperties([]);
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  const handleAddProperty = () => {
    setIsDrawerOpen(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    API.post("/properties", newProperty)
      .then((response) => {
        console.log("Property saved successfully:", response);
        fetchProperties();
        setIsDrawerOpen(false);
        setNewProperty({});
      })
      .catch((error) => {
        console.error("Error saving property:", error);
      });
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value,
    }));
  };

  return (
    <>
      <Button onClick={handleAddProperty}>
        <PlusIcon className="" />
        Add New Property
      </Button>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Add New Property</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <div className="p-4">
              <form>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title:
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter title"
                    value={newProperty.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address:
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter address"
                    value={newProperty.address}
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
                    value={newProperty.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Photo:
                  </label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="units"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Units:
                  </label>
                  <Input
                    id="units"
                    name="units"
                    type="number"
                    placeholder="Enter number of units"
                    value={newProperty.units}
                    onChange={handleInputChange}
                  />
                </div>
                <Button className="mr-2" onClick={handleSaveProperty}>
                  Save
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={closeDrawer}>
                    Cancel
                  </Button>
                </DrawerClose>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {properties.map(({ id, title, address, units, photo, description }) => (
          <Link key={id} to={`/property/${id}`} className="max-w-xs">
            {" "}
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
    </>
  );
}

export default Properties;
