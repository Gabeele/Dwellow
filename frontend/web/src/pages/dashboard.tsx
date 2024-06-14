import DefaultCard from "@/components/DefaultCard";
import DefaultTicket from "@/components/DefaultTicket";
import { Link } from "react-router-dom";
import API from "../utils/Api";
import { useEffect, useState } from "react";
import { fetchProperties } from "./properties";

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

function Home() {
  const [user, setUser] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Check if user data is cached
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    } else {
      getUser();
    }
  }, []);

  useEffect(() => {
    if (user.length > 0) {
      setName(user[0].fullName);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const cachedProperties = localStorage.getItem("properties");
    if (cachedProperties) {
      setProperties(JSON.parse(cachedProperties));
    } else {
      fetchProperties().then(setProperties);
    }
  }, []);

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
        }
      } else {
        console.error(
          "Failed to fetch user data, status code:",
          response.status
        );
        setUser([]);
      }
    } catch (error: any) {
      console.error("Cannot retrieve user:", error.message);
    }
  };

  return (
    <div className="">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dwellow-dark-200">Dashboard</h1>
        <p className="text-dwellow-dark-200 mt-2">Welcome, {name}</p>
        <div className="mt-9">
          <h1 className="text-xl font-bold text-dwellow-dark-200">Properties</h1>
          <div className="flex flex-col bg-dwellow-white-0 mt-4 p-4 rounded-lg">
            <div className="inline-flex space-x-4">
              {properties.map((property) => (
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
            <div className="inline-flex space-x-5">
              <DefaultTicket/>
              <DefaultTicket/>
              <DefaultTicket/>
            </div>
            <div className="inline-flex space-x-5 mt-5">
              <DefaultTicket/>
              <DefaultTicket/>
              <DefaultTicket/>
            </div>
            <div className="pt-4 ml-auto mr-0">
              <Link to="/tickets" className="text-dwellow-dark-100 hover:underline">See All Tickets</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
