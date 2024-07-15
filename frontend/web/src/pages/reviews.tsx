import React, { useState, useEffect } from "react";
import API from "../utils/Api";
import { Input } from "@/components/ui/input";
import LandingNavigation from "@/components/LandingNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Component: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchSuggestions = async () => {
        try {
          const response = await API.get(`/get-property?search=${searchTerm}`);
          const data = await response.data;
          setSuggestions(data.properties);
        } catch (error) {
          console.error("Error fetching properties:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSelect = async (item: any) => {
    setSearchTerm(item.name);
    setSuggestions([]);
    try {
      const response = await API.get(`/review/${item.id}`);
      const data = await response.data;
      setSelectedProperty(data);
    } catch (error) {
      console.error("Error fetching property reviews:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavigation />
      <main className="flex-1 bg-background">
        <section
          className="py-12 md:py-16 lg:py-20 text-center"
          style={{
            backgroundImage: 'url("/apartment-building2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Welcome to Dwellow
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Search for rental properties and read reviews from tenants to find
              your perfect home.
            </p>
            <div className="flex justify-center relative">
              <Input
                type="search"
                placeholder="Search for a rental property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-3xl px-6 py-4 text-lg rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSelect(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-black">
                  <li>Look up the unit you're interested in.</li>
                  <li>
                    Get a score based on criteria like walk score, response
                    time, and communication.
                  </li>
                  <li>Make your decision with confidence!</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>
        {selectedProperty && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-12 md:py-16 lg:py-20">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">
                {selectedProperty.name}
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedProperty.walkScore}
                  </div>
                  <div className="text-muted-foreground">Walk Score</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedProperty.responseTime}
                  </div>
                  <div className="text-muted-foreground">Response Time</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedProperty.communication}
                  </div>
                  <div className="text-muted-foreground">Communication</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedProperty.overallGrade}
                  </div>
                  <div className="text-muted-foreground">Overall Grade</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={selectedProperty.image || "/placeholder.svg"}
                width={600}
                height={400}
                alt="Property Image"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Component;
