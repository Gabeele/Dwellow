import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const properties = [
  {
    id: 1,
    title: "Sunny Apartment",
    address: "123 Sunny Street, Sunville",
    units: 5,
    photo: "https://via.placeholder.com/150",
  },
];

function Properties() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {properties.map(({ id, title, address, units, photo }) => (
        <a
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
          href="/properties/${id}"
        >
          <Card key={id} className="max-w-xs">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{address}</CardDescription>
            </CardHeader>
            <CardContent>
              <img className="w-full" src={photo} alt={`Property ${id}`} />
              <p className="mt-4">{units} Units</p>
            </CardContent>
            <CardFooter>
              {/* You can place any footer content here, such as links or actions specific to the property */}
              <p>Explore this property</p>
            </CardFooter>
          </Card>
        </a>
      ))}
    </div>
  );
}

export default Properties;
