import DefaultCard from "@/components/DefaultCard";
import DefaultTicket from "@/components/DefaultTicket";
import { Link } from "react-router-dom";
import API from "../utils/Api";
import { useEffect, useState } from "react";
import { fetchProperties } from "./properties";
import { fetchTickets } from "./tickets";
import Loading from "@/components/Loading";

interface User {
  email: string;
  fullName: string;
  phoneNumber: string;
}

interface Property {
  id: string;
  title: string;
  address: string;
  units: number;
  photo: string;
  description: string;
}

interface Ticket {
  id: number;
  description: string;
  unit_id: number;
  user_id: number;
  length: string;
  issue_area: string;
  photo_url: string;
  special_instructions: string;
  priority: string;
  status: string;
  time_created: string;
  time_updated: string;
  queue: number;
  time_resolved: string;
  property_id: number;
}

function Home() {
  const [user, setUser] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const getUser = async () => {
    try {
      const response = await API.get("/account");
      if (response.status === 200) {
        const jsonData = await response.data;
        if (jsonData != null) {
          const retrievedUser = jsonData.map((user: any) => ({
            fullName: user.full_name || "Test",
            email: user.email,
            phoneNumber: user.phone_number,
          }));
          setUser(retrievedUser);
          localStorage.setItem("user", JSON.stringify(retrievedUser));
        }
        setLoadingUser(false);
      } else {
        console.error("Failed to fetch user data, status code:", response.status);
        if (response.status === 401) {
          setTimeout(getUser, 2000);
        }
      }
    } catch (error: any) {
      console.error("Cannot retrieve user:", error.message);
    }
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setLoadingUser(false);
    } else {
      getUser();
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const cachedProperties = localStorage.getItem("properties");
      const cachedTickets = localStorage.getItem("tickets");

      if (cachedProperties) {
        setProperties(JSON.parse(cachedProperties));
        setLoadingProperties(false);
      } else {
        try {
          const propertiesData = await fetchProperties();
          setProperties(propertiesData);
          localStorage.setItem("properties", JSON.stringify(propertiesData));
          setLoadingProperties(false);
        } catch (error) {
          console.error("Failed to fetch properties:", error);
        }
      }

      if (cachedTickets) {
        setTickets(JSON.parse(cachedTickets));
        setLoadingTickets(false);
      } else {
        try {
          const ticketsData = await fetchTickets();
          setTickets(ticketsData);
          localStorage.setItem("tickets", JSON.stringify(ticketsData));
          setLoadingTickets(false);
        } catch (error) {
          console.error("Failed to fetch tickets:", error);
        }
      }
    };

    if (user.length > 0) {
      fetchAllData();
      setName(user[0].fullName);
    }
  }, [user]);

  const isLoading = loadingUser || loadingProperties || loadingTickets;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-dwellow-dark-200">Dashboard</h1>
      <p className="text-dwellow-dark-200 mt-2">Welcome, {name}</p>
      <div className="mt-9">
        <h1 className="text-xl font-bold text-dwellow-dark-200">Properties</h1>
        <div className="flex flex-col bg-dwellow-white-0 mt-4 p-4 rounded-lg">
          <div className="grid grid-cols-5 gap-4 justify-center items-center">
            {properties.slice(0, 5).map((property) => (
              <Link key={property.id} to={`/property/${property.id}`} className="max-w-xs">
                <DefaultCard
                  id={property.id}
                  title={property.title}
                  address={property.address}
                  units={property.units}
                  photo={property.photo}
                  description={property.description}
                />
              </Link>
            ))}
          </div>
          <div className="pt-4 ml-auto mr-0">
            <Link to="/properties" className="text-dwellow-dark-100 hover:underline">See All Properties</Link>
          </div>
        </div>
      </div>
      <div className="mt-9">
        <h1 className="text-xl font-bold text-dwellow-dark-200">Open Tickets</h1>
        <div className="flex flex-col bg-dwellow-white-0 mt-4 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 justify-center items-center">
            {tickets.slice(0, 6).map((ticket) => (
              <Link key={ticket.id} to={`/ticket/${ticket.id}`} className="w-full">
                <DefaultTicket
                  id={ticket.id}
                  description={ticket.description}
                  special_instructions={ticket.special_instructions}
                  time_created={new Date(ticket.time_created).toLocaleString()}
                  status={ticket.status}
                />
              </Link>
            ))}
          </div>
          <div className="pt-4 ml-auto mr-0">
            <Link to="/tickets" className="text-dwellow-dark-100 hover:underline">See All Tickets</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
