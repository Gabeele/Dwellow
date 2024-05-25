import LandingNavigation from "@/components/LandingNavigation";

const Register: React.FC = () => {
  return (
    <div>
      <LandingNavigation/>
      <div className="absolute top-0 flex justify-center flex-col items-center h-screen w-full bg-dwellow-white-200">
        <h1 className="text-3xl font-bold mb-4 text-dwellow-primary-300 flex justify-center items-center">
          I am registering as a(n)...
        </h1>
        <a href="/register/admin" className="hover:underline">Admin</a>
        <a href="/register/tenant" className="hover:underline">Tenant</a>

        <a className="text-center mt-4 text-dwellow-primary-300 text-sm font-semibold hover:underline"
        href="/">
          Go Back
        </a>
        <footer className="w-full bg-dwellow-primary-300 flex flex-row items-center space-x-7 justify-center text-dwellow-white-100 font-normal text-sm absolute bottom-0">
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
