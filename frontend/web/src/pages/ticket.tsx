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

function Ticket() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  //const [loading, setLoading] = useState(true);

  // local caching
  useEffect(() => {
    const cachedProperty = localStorage.getItem(`property-${id}`);
    const cachedUnits = localStorage.getItem(`units-${id}`);

    console.log(cachedUnits)

    if (cachedProperty && cachedUnits) {
      setProperty(JSON.parse(cachedProperty));
      setUnits(JSON.parse(cachedUnits));
      //setLoading(false);
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

        // store things in cache
        localStorage.setItem(`property-${id}`, JSON.stringify(jsonData.property));
        localStorage.setItem(`units-${id}`, JSON.stringify(jsonData.units || []));
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Failed to fetch property data:", error);
    }
    //setLoading(false);
  };

  //if (loading) {
    //return <Loading />;
  //}

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
      </div>
      <div className="my-5 space-x-5">

      </div>

      <h1 className="text-xl font-bold text-dwellow-dark-200">Open Tickets</h1>
    </div>
    </>
  );
}

export default Ticket;
