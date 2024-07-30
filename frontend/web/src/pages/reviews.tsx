"use client";

import { useState, useEffect, SVGProps } from "react";
import API from "../utils/Api";
import { Input } from "@/components/ui/input";
import { JSX } from "react/jsx-runtime";
import LandingNavigation from "@/components/LandingNavigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Review {
  address: string;
  averageResolutionTime: number;
  unitToTicketRatio: number;
  responseScore: number;
  finalScore: number;
}

interface Property {
  address: string;
}

interface PropertyWithScore extends Property {
  finalScore: number | null;
}

export default function Component() {
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<PropertyWithScore[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await API.get("/public/guest");
        const data = await response.data;
        console.log("Properties response:", data);

        if (data && Array.isArray(data.data)) {
          const properties: PropertyWithScore[] = data.data.map(
            (property: Property) => ({
              ...property,
              finalScore: null,
            })
          );

          const updatedProperties = await Promise.all(
            properties.map(async (property) => {
              try {
                const scoreResponse = await API.get(
                  `/public/score/${encodeURIComponent(property.address)}`
                );
                const scoreData = await scoreResponse.data;
                return { ...property, finalScore: scoreData[0].FinalScore };
              } catch (error) {
                console.error(
                  `Error fetching score for ${property.address}:`,
                  error
                );
                return property;
              }
            })
          );

          setSuggestions(updatedProperties);
        } else {
          console.error("Unexpected properties response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  const handleSelect = async (item: PropertyWithScore) => {
    setSearchTerm(item.address);
    setSuggestions([]);
    try {
      const response = await API.get(
        `/public/score/${encodeURIComponent(item.address)}`
      );
      const data = await response.data;
      const review = {
        address: data[0].Address,
        averageResolutionTime: data[0].AverageResolutionTime,
        unitToTicketRatio: data[0].UnitToTicketRatio,
        responseScore: data[0].ResponseScore,
        finalScore: data[0].FinalScore,
      };
      setSelectedReview(review);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching property score:", error);
    }
  };

  return (
    <>
      <LandingNavigation />
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-background">
        <div className="w-1/3 p-6">
          <div className="mb-6 w-full">
            <h1
              className="text-4xl font-bold text-card-foreground"
              style={{ fontSize: "32px" }}
            >
              Review Lookup
            </h1>
            <p
              className="text-2xl text-muted-foreground"
              style={{ fontSize: "24px" }}
            >
              Find reviews by entering a product or service name.
            </p>
          </div>
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search for a review..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xl px-4 py-2 pr-10 h-14 text-card-foreground bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              style={{ fontSize: "22px" }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            {searchTerm.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-input rounded-md shadow-lg">
                <div className="py-2 max-h-64 overflow-auto">
                  {suggestions
                    .filter((item) =>
                      item.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-muted hover:text-muted-foreground cursor-pointer"
                        onClick={() => handleSelect(item)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-card-foreground font-medium">
                              {item.address}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {showModal && selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-card rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold text-card-foreground mb-6">
                {selectedReview.address}
              </h1>
              <div className="flex">
                <div className="flex flex-col items-center justify-center w-1/3">
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-primary text-primary text-3xl font-bold">
                    {selectedReview.finalScore}
                  </div>
                  <div className="flex items-center mt-4">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarIcon
                        key={starIndex}
                        className={`w-6 h-6 ${
                          starIndex < Math.round(selectedReview.finalScore / 20)
                            ? "fill-primary"
                            : "fill-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-2/3 pl-6">
                  <TooltipProvider>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">
                          Average Resolution Time:
                        </span>
                        <Tooltip>
                          <TooltipTrigger className="text-muted-foreground">
                            <InfoIcon className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              The average time taken to resolve tickets in
                              hours.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{selectedReview.averageResolutionTime} hours</p>

                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">
                          Ticket to Unit Ratio:
                        </span>
                        <Tooltip>
                          <TooltipTrigger className="text-muted-foreground">
                            <InfoIcon className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              The number of tickets per unit in the property.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{selectedReview.unitToTicketRatio}</p>

                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">
                          Response Score:
                        </span>
                        <Tooltip>
                          <TooltipTrigger className="text-muted-foreground">
                            <InfoIcon className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              The score based on the responsiveness to tickets.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{selectedReview.responseScore}</p>

                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">
                          Overall Score:
                        </span>
                        <Tooltip>
                          <TooltipTrigger className="text-muted-foreground">
                            <InfoIcon className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              The final score representing the overall quality.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{selectedReview.finalScore}</p>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-center mt-10">
          <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-gray-300 rounded-lg shadow-lg h-60 w-80 m-4">
            <div className="bg-gray-100 rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold text-black mb-2">
                How are Reviews Made?
              </h3>
              <p className="text-black">
                Review scoring is done based on quantitative data collected from
                our databases, like average resolution time and ticket to unit
                ratio.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-gray-300 rounded-lg shadow-lg h-60 w-80 m-4">
            <div className="bg-gray-100 rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold text-black mb-2">
                How do I Interpret Scores?
              </h3>
              <p className="text-black">
                Scores are calculated based on ratios, averages, and comparisons
                between properties in the Dwellow network.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-gray-300 rounded-lg shadow-lg h-60 w-80 m-4">
            <div className="bg-gray-100 rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold text-black mb-2">
                How is Feedback Incorporated?
              </h3>
              <p className="text-black">
                This rating reflects property management efficiency, not tenant
                sentiment, offering an objective view of service quality without
                personal bias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function InfoIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}
