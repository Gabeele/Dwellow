import React from "react";

function Home() {
  return (
    <div className="bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-gray-800">
                My Website
              </a>
            </div>
            <div className="flex items-center">
              <a
                href="/about"
                className="text-gray-600 hover:text-gray-800 px-4"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-gray-800 px-4"
              >
                Contact
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to My Website
        </h1>
        <p className="text-gray-600 mt-4">
          This is the home page of my website.
        </p>
      </main>
      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            © 2022 My Website. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
