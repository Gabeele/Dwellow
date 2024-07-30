import React from "react";

const AdminScreenshots: React.FC = () => {
  return (
    <section id="AdminScreenshots" className="pt-16 text-white m-auto">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Admin Portal</h1>
        <p className="text-white text-center mb-8">
          The Dwellow admin portal provides a comprehensive suite of tools to
          manage your properties, units, tenants, and more.
        </p>

        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-dwellow-dark-300  rounded-lg shadow-lg mb-8 md:mb-0 w-full md:w-1/2 lg:w-1/3">
            <div className="bg-dwellow-dark-200  rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold">Update your Tickets</h3>
              <p className="mt-2">
                Manage a ticket with comments, queuing, and status changes all
                in one place. Push these right to your tenants and staff.
                Allowing for a powerful communication tool that keeps everyone
                in the loop.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/2 p-4">
            <img
              src="/admin1.png"
              alt="Real-time insights"
              className="w-full h-96 rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="w-full md:w-1/2 lg:w-1/2 p-4 order-1 md:order-2">
            <img
              src="/admin2.png"
              alt="Connect all contacts"
              className="w-full h-96 rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-dwellow-dark-300  rounded-lg shadow-lg mb-8 md:mb-0 w-full md:w-1/2 lg:w-1/3 order-2 md:order-1">
            <div className="bg-dwellow-dark-200  rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold">Manage Properties and More</h3>
              <p className="mt-2">
                Manage multiple properties, units, tenants, and team-staff to
                track everything! View quick assess information from the
                dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col items-center text-center relative p-1 bg-gradient-to-r from-green-600 to-dwellow-dark-300  rounded-lg shadow-lg mb-8 md:mb-0 w-full md:w-1/2 lg:w-1/3">
            <div className="bg-dwellow-dark-200  rounded-lg p-6 shadow-md w-full h-full flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold">
                Assign Tenants and Push Announcements
              </h3>
              <p className="mt-2">
                Utilize the invite code feature to invite a tenant to Dwellow.
                Send announcements to all tenants of a property with ease!
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/2 p-4">
            <img
              src="/admin3.png"
              alt="Dashboards"
              className="w-full h-96 rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminScreenshots;
