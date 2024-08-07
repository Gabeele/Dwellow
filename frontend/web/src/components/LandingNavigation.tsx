/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Btw4Mz43Tv0
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Link, scroller } from "react-scroll";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (section: string) => {
    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
      });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      scrollTo(location.state.scrollTo);
    }
  }, [location, scrollTo]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-10 bg-[#1a1a1a] bg-opacity-80 backdrop-blur-md backdrop-opacity-80 text-white p-4 flex items-center">
      <div className="container mx-auto flex justify-center">
        <RouterLink to="/" className="absolute left-8 text-2xl font-bold">
          Dwellow
        </RouterLink>
        <div className="hidden md:flex space-x-6 items-center">
          <Button
            onClick={() => scrollTo("PageTop")}
            variant="link"
            className="text-dwellow-white-100 font-normal text-base hover:text-gray-400 hover:no-underline"
          >
            Home
          </Button>
          <Button
            onClick={() => scrollTo("About")}
            variant="link"
            className="text-dwellow-white-100 font-normal text-base hover:text-gray-400 hover:no-underline"
          >
            About
          </Button>
          <Button
            onClick={() => scrollTo("Features")}
            variant="link"
            className="text-dwellow-white-100 font-normal text-base hover:text-gray-400 hover:no-underline"
          >
            Features
          </Button>
          <Button
            onClick={() => scrollTo("Contact")}
            variant="link"
            className="text-dwellow-white-100 font-normal text-base hover:text-gray-400 hover:no-underline"
          >
            Contact
          </Button>
          <RouterLink to="/reviews">Reviews</RouterLink>
          <div className="absolute right-8">
            <RouterLink
              to="/login"
              className="px-4 py-2 mr-4 rounded-md bg-gray-600 text-white hover:bg-gray-500"
            >
              Log in
            </RouterLink>
            <RouterLink to="/register/admin">
            <Button
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-black"
            >
              Get Started
            </Button>
          </RouterLink>
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <Button
            variant="outline"
            className="border-white text-black"
            onClick={toggleDrawer}
          >
            Menu
          </Button>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={toggleDrawer}
        >
          <div className="w-full h-full bg-black backdrop-blur-md text-white p-2 z-30 rounded-lg">
            <button className="text-white text-xl mb-4" onClick={toggleDrawer}>
              ×
            </button>
            <nav className="flex flex-col space-y-4 bg-black backdrop-blur-md  p-4 bg-opacity-97 rounded-lg ">
              <Link
                to="PageTop"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-gray-400"
                onClick={toggleDrawer}
              >
                Home
              </Link>
              <Link
                to="About"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-gray-400"
                onClick={toggleDrawer}
              >
                About
              </Link>
              <Link
                to="Features"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-gray-400"
                onClick={toggleDrawer}
              >
                Features
              </Link>
              <Link
                to="Contact"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:text-gray-400"
                onClick={toggleDrawer}
              >
                Contact
              </Link>
              <RouterLink to="/reviews">Reviews</RouterLink>
              <Button
                className="w-28 bg-gray-600 text-white hover:bg-gray-500"
              >
                <RouterLink to="/login" onClick={toggleDrawer}>
                Log in
                </RouterLink>
              </Button>
              <Button
                variant="outline"
                className="w-28 border-white text-black hover:bg-white hover:text-black"
              >
                <RouterLink to="/register/admin" onClick={toggleDrawer}>
                  Get Started
                </RouterLink>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
