import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/Api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";

interface User {
    email: string;
    fullName: string;
    phoneNumber: string;
  }

function Manage(){
    const { id } = useParams<{ id: string }>();
    const [team, setTeam] = useState<User[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);

    const fetchTeam = async (id: any) => {
        try {
            const response = await API.get(`/account/${id}`)
            if (response.status === 200) {
                const jsonData = await response.data;
                if (jsonData != null) {
                    const resTeam = jsonData.data.map((user: any) => ({
                      fullName: user.full_name,
                      email: user.email,
                      phoneNumber: user.phone_number,
                    }));
                    setTeam(resTeam);
                    localStorage.setItem(`team`, JSON.stringify(resTeam));
                  }
                setLoadingTeam(false);
            } else {
                console.error("Failed to fetch user data, status code:", response.status);
                if (response.status === 401) {
                    setTimeout(() => fetchTeam(id), 2000);
                }
              }
        } catch(error) {
            console.error("Error fetching team members:", error);
        }
    };

    useEffect(() => {
        const cachedTeam = localStorage.getItem(`team`);
        if (cachedTeam) {
          setTeam(JSON.parse(cachedTeam));
          setLoadingTeam(false);
        } else {
          fetchTeam(id);
        }
      }, []);

      const isLoading = loadingTeam;

      if (isLoading) {
        return <Loading />;
      }

    return(
        <>
        <div className="">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-dwellow-dark-200 mb-5">Manage Team</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {team.map(({ email, fullName, phoneNumber }) => (
                        <TableRow key={id}>
                            <TableCell className="text-wrap">{fullName}</TableCell>
                            <TableCell className="text-wrap">{email}</TableCell>
                            <TableCell className="text-wrap">{phoneNumber}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </main>
            
        </div>
        </>
    );
}

export default Manage;