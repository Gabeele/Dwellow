import React from "react";

const FakeBusinessScroll: React.FC = () => {
  const businessNames = [
    "Apartment One",
    "City Heights",
    "Downtown Living",
    "Urban Residences",
    "Suburban Estates",
    "Green Park Apartments",
    "Luxury Living",
    "Skyline Towers",
    "Modern Flats",
    "Parkview Residences",
    "Riverfront Apartments",
    "Harbor View",
    "Lakefront Living",
    "Mountain View",
    "Sunset Apartments",
    "Oceanfront Residences",
    "Seaside Living",
    "Beachfront Apartments",
    "Coastal Residences",
    "Island Living",
    "Tropical Apartments",
    "Palm Tree Residences",
  ];

  const containerStyle: React.CSSProperties = {
    display: "flex",
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    height: "100%",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    paddingLeft: "100%",
    animation: "scroll 75s linear infinite",
  };

  const itemStyle: React.CSSProperties = {
    display: "inline-block",
    margin: "0 20px",
    whiteSpace: "nowrap",
    lineHeight: "4rem", // This will help to vertically center the text
  };

  const keyframes = `
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
  `;

  return (
    <div className="relative w-full overflow-hidden h-16 bg-dwellow-dark-200  shadow-lg">
      <style>{keyframes}</style>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-dwellow-gray-200 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-dwellow-dark-200 to-transparent z-10"></div>
      <div style={containerStyle}>
        <div style={contentStyle}>
          {businessNames.concat(businessNames).map((name, index) => (
            <div
              key={index}
              style={itemStyle}
              className="text-dwellow-white-200 text-lg font-bold"
            >
              {name}
            </div>
          ))}
        </div>
        <div style={contentStyle}>
          {businessNames.concat(businessNames).map((name, index) => (
            <div
              key={index + businessNames.length}
              style={itemStyle}
              className="text-dwellow-white-200 text-lg font-bold"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FakeBusinessScroll;
