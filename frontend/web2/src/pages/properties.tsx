import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/Api"; // Make sure the import path is correct
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

interface Property {
  id: number;
  title: string;
  address: string;
  units: number;
  photo: string;
}

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    API.get("/properties")
      .then((response) => {
        const propertiesData: Property[] = response.map((property: any) => ({
          id: property.id,
          title: property.title,
          address: property.address,
          units: property.units || "N/A",
          photo: property.photo || "apartment-building.jpg",
        }));
        console.log(propertiesData);

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
  }, []);

  return (
    <>
      <Button>
        <PlusIcon className="" />
        Add New Property
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {properties.map(({ id, title, address, units, photo }) => (
          <Link key={id} to={`/properties/${id}`} className="max-w-xs">
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

              <CardFooter />
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Properties;
