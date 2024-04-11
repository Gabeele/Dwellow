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

interface Property {
  id: number;
  title: string;
  address: string;
}

interface Unit {
  id: number;
  unit: string;
  property_id: number;
  tenant_id: number;
  description: string | null;
  email: string;
  full_name: string;
  phone_number: string;
}

function Property() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);

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

  return (
    <>
      <h2>Property Detail</h2>
      <p>Property ID: {id}</p>
      {property && (
        <div>
          <h2>{property.title}</h2>
          <p>{property.address}</p>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit</TableHead>
            <TableHead>Tenant Email</TableHead>
            <TableHead>Tenant Name</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>{unit.unit}</TableCell>
              <TableCell>{unit.email}</TableCell>
              <TableCell>{unit.full_name}</TableCell>
              <TableCell>{unit.phone_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Property;
