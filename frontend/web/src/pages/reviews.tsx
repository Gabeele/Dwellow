import React, { useState, useEffect } from "react";
import API from "../utils/Api";
import { Input } from "@/components/ui/input";

const Component: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get("/public/guest");
        const data = await response.data;
        setSuggestions(data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  const handleSelect = async (item: any) => {
    setSearchTerm(item.address);
    setSuggestions([]);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center"
      style={{
        backgroundImage: 'url("/apartment-building2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-md shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
          Welcome to Dwellow
        </h1>
        <p className="text-lg md:text-xl mb-8 text-black">
          Search for rental properties and read reviews from tenants to find
          your perfect home.
        </p>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search for a rental property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-3xl px-6 py-4 text-lg rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10">
              {suggestions
                .filter((item) =>
                  item.address.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item.address}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Component;
