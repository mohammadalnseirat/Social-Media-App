import Link from "next/link";
import DeskTopNavbar from "./DeskTopNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

const Navbar = async () => {
  const user = await currentUser();
  if (user) syncUser();
  return (
    <nav className="sticky top-0 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Start Here */}
          <div className="flex justify-center md:justify-start items-center w-full">
            <Link
              href={"/"}
              className="text-2xl  font-bold text-green-500 hover:text-green-600 transition-colors duration-200 tracking-wider "
            >
              Socially
            </Link>
          </div>
          {/* Logo End Here */}

          {/* Desktop Nav Start Here */}
          <DeskTopNavbar />
          {/* Desktop Nav End Here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
