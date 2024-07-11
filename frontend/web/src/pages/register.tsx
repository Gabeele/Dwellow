import LandingNavigation from "@/components/LandingNavigation";
import { Button } from "@/components/ui/button";

const Register: React.FC = () => {
  return (
    <div>
      <LandingNavigation/>
      <div className="absolute top-0 flex justify-center flex-col items-center h-screen w-full bg-dwellow-white-200">
        <h1 className="text-3xl font-bold mb-3 text-dwellow-dark-200 flex justify-center items-center">
          I am Registering as a(n)...
        </h1>
        <div className="space-x-16 mt-12">
          <a href="/register/admin">
            <Button className="p-9 text-lg text-dwellow-dark-200 stroke-dwellow-dark-200 bg-dwellow-white-100 hover:bg-dwellow-dark-100 hover:text-dwellow-white-200">
              Admin</Button></a>
          <a href="/register/tenant">
            <Button className="p-9 text-lg text-dwellow-dark-200 stroke-dwellow-dark-200 bg-dwellow-white-100 hover:bg-dwellow-dark-100 hover:text-dwellow-white-200">
              Tenant</Button></a>
        </div>
        <a className="text-center mt-9 text-dwellow-dark-200 text-sm font-semibold hover:underline"
        href="/">
          Go Back
        </a>
        <footer className="w-full bg-dwellow-dark-200 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom-0">
          <a href="" className="hover:underline">
            Terms of Use
          </a>
          <p>Dwellow © 2024</p>
          <a href="" className="hover:underline">
            Privacy Policy
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Register;
