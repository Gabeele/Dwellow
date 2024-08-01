import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Upload, Download, Plus } from "lucide-react";
import API from "../utils/Api";
import Loading from "@/components/Loading";

interface Tenant {
  contract_id: number;
  contract_url: string;
  contract_date: string;
  tenant_id: number;
  tenant_name: string;
  unit_id: number;
  unit_description: string;
  property_id: number;
  property_title: string;
}

const Contracts: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await API.get("/properties/contracts");
        if (response.status === 200) {
          const data = await response.data;
          setTenants(data);
          setLoading(false);
        } else {
          console.error(
            "Failed to fetch tenants, status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchTenants();
  }, []);

  const handleRemove = (tenantId: number) => {
    console.log(`Removing tenant with ID: ${tenantId}`);
  };

  const handleEdit = (tenantId: number) => {
    console.log(`Editing tenant with ID: ${tenantId}`);
  };

  const handleAssignContract = (tenantId: number) => {
    console.log(`Assigning contract to tenant with ID: ${tenantId}`);
  };

  const handlePropertyAction = (propertyId: number) => {
    console.log(`Property action for property with ID: ${propertyId}`);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/29-2024-07-01.pdf";
    link.download = "29-2024-07-01.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddContract = () => {
    console.log("Adding a new contract");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Tenant Contracts</CardTitle>
        <CardDescription>
          View and manage your tenants' contracts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {tenant.tenant_name}
                  </TableCell>
                  <TableCell>
                    {tenant.property_title}{" "}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePropertyAction(tenant.property_id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Property Action</span>
                    </Button>
                  </TableCell>
                  <TableCell>{tenant.unit_description}</TableCell>
                  <TableCell>
                    {tenant.contract_url ? (
                      <a href={tenant.contract_url}>Download</a>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAssignContract(tenant.tenant_id)}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Assign Contract</span>
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tenant.tenant_id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(tenant.tenant_id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddContract}>
          <Plus className="h-4 w-4" />
          <span className="ml-2">Add Contract</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Contracts;
