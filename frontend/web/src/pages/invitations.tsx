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

interface InviteCode {
    id: number;
    code: string;
    email: string;
    property_id: number;
    unit_id: number;
    is_used: number;
    is_deleted: number;
    user_id: number;
}

function Invitations(){
    const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);

    const fetchInvitationCodes = async (id: any) => {
        try {
            const response = await API.get(`/invitation/property/${id}`)

        } catch(error) {
            console.error("Error fetching invite codes:", error);
        }
    };

    return(
        <>
        <div className="">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-dwellow-dark-200">Invitations</h1>
            </main>
        </div>
        </>
    );
}

export default Invitations;