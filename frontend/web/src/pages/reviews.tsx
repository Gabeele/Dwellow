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
    try {
      const response = await API.get(
        `/public/score/${encodeURIComponent(item.address)}`
      );
      const data = await response.data;
      console.log(data[0]);
      setSelectedProperty(data[0]);
    } catch (error) {
      console.error("Error fetching property score:", error);
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
              {searchTerm.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10">
                  {suggestions
                    .filter((item) =>
                      item.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
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
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>How Scores Are Calculated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black mb-4">
                  Our scoring system helps tenants make informed decisions by
                  evaluating properties based on various criteria. Here's how we
                  calculate the scores:
                </p>
                <ul className="list-disc list-inside space-y-2 text-black">
                  <li>
                    <strong>Average Response Time:</strong> This score measures
                    the average time taken by the property administration to
                    respond to tenant inquiries and maintenance requests. A
                    shorter response time indicates more efficient
                    communication.
                  </li>
                  <li>
                    <strong>Amount of Open Tickets:</strong> This metric
                    reflects the number of unresolved maintenance or service
                    requests. Fewer open tickets suggest that the property
                    management is proactive and efficient in addressing tenant
                    issues.
                  </li>
                  <li>
                    <strong>Average Length of Tenancy:</strong> This score
                    represents the average duration that tenants stay at a
                    property. Longer tenancies often indicate tenant
                    satisfaction and good property management.
                  </li>
                  <li>
                    <strong>Walk Score:</strong> This score evaluates the
                    walkability of the property’s location, considering factors
                    like proximity to shops, parks, and public transport.
                  </li>
                  <li>
                    <strong>Communication Quality:</strong> This score assesses
                    the clarity, helpfulness, and frequency of communication
                    from property management. Good communication helps ensure
                    that tenants feel heard and supported.
                  </li>
                  <li>
                    <strong>Overall Grade:</strong> This is a composite score
                    that combines all the individual metrics to give an overall
                    rating of the property. It provides a quick summary of the
                    property's performance across various aspects.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Join the Dwellow Network
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              Ensure your property stands out by joining the Dwellow network.
              Get rated on criteria like response time, communication quality,
              and tenant satisfaction. Improve your property management and
              attract quality tenants.
            </p>
            <button className="px-6 py-4 text-lg rounded-full bg-primary text-white hover:bg-primary-dark transition duration-300">
              Talk to Your Property Admin Today
            </button>
          </div>
        </section>
        {selectedProperty && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-12 md:py-16 lg:py-20">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold">
                {selectedProperty.title}
              </h1>
              <p className="text-lg text-gray-700">
                {selectedProperty.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {selectedProperty.PropertyScore}
                  </div>
                  <div className="text-muted-foreground">Score</div>
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
