
import DefaultCard from "@/components/DefaultCard";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-dwellow-dark-200">Dashboard</h1>
        <p className="text-dwellow-dark-200 mt-2">Welcome, User</p>
        <div className="mt-9">
          <h1 className="text-xl font-bold text-dwellow-dark-200">Properties</h1>
          <div className="flex flex-col bg-dwellow-white-0 mt-4 p-4 rounded-lg">
            <div className="inline-flex space-x-4">
              <DefaultCard/>
              <DefaultCard/>
              <DefaultCard/>
              <DefaultCard/>
              <DefaultCard/>
              <DefaultCard/>
            </div>
            <div className="pt-4 ml-auto mr-0">
              <Link to="/properties" className="text-dwellow-dark-100 hover:underline">See All Properties</Link>
            </div>
          </div>
        </div>
        <div className="mt-9">
          <h1 className="text-xl font-bold text-dwellow-dark-200">Open Tickets</h1>
          <div className="bg-dwellow-white-0 mt-4 p-10 pb-20 rounded-lg">
            <Link to="/tickets" className="text-dwellow-dark-100 hover:underline">See All Tickets</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
