import { useState } from "react";
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
import { Eye, Edit, Trash } from "lucide-react";

interface Contact {
  id: number;
  company: string;
  name: string;
  phone: string;
  emergencyPhone: string;
  email: string;
}

export default function Component() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      company: "BlueWave Plumbing",
      name: "Sara Wilson",
      phone: "555-1122",
      emergencyPhone: "555-3344",
      email: "sara@bluewaveplumbing.com",
    },
    {
      id: 2,
      company: "GreenLeaf Landscapes",
      name: "Mike Johnson",
      phone: "555-2233",
      emergencyPhone: "555-4455",
      email: "mike@greenleaflandscapes.com",
    },
    {
      id: 3,
      company: "BrightSpark Electric",
      name: "Emily Davis",
      phone: "555-3344",
      emergencyPhone: "555-5566",
      email: "emily@brightsparkelectric.com",
    },
    {
      id: 4,
      company: "SnowSafe Services",
      name: "Robert Brown",
      phone: "555-4455",
      emergencyPhone: "555-6677",
      email: "robert@snowsafeservices.com",
    },
    {
      id: 5,
      company: "RoofShield Repairs",
      name: "Nancy White",
      phone: "555-5566",
      emergencyPhone: "555-7788",
      email: "nancy@roofshieldrepairs.com",
    },
    {
      id: 6,
      company: "Ace Security",
      name: "Peter Black",
      phone: "555-6677",
      emergencyPhone: "555-8899",
      email: "peter@acesecurity.com",
    },
    {
      id: 7,
      company: "TotalClean Services",
      name: "Karen Green",
      phone: "555-7788",
      emergencyPhone: "555-9900",
      email: "karen@totalcleanservices.com",
    },
    {
      id: 8,
      company: "Elite Pest Control",
      name: "James Thompson",
      phone: "555-8899",
      emergencyPhone: "555-1010",
      email: "james@elitepestcontrol.com",
    },
    {
      id: 9,
      company: "ProFix Maintenance",
      name: "Laura Martinez",
      phone: "555-9900",
      emergencyPhone: "555-1111",
      email: "laura@profixmaintenance.com",
    },
    {
      id: 10,
      company: "Prime Heating & Cooling",
      name: "Chris King",
      phone: "555-1010",
      emergencyPhone: "555-1212",
      email: "chris@primeheatingcooling.com",
    },
  ]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contacts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>
            View and manage your network of contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Emergency Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.emergencyPhone}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
