import { Fahkwang } from "next/font/google";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

async function DeskTopNavbar() {
  const user = await currentUser();
  return (
    <>
      <div className="hidden md:flex items-center space-x-4">
        <ModeToggle />
        <Button
          className="flex items-center gap-2 border"
          variant={"ghost"}
          asChild
        >
          <Link href="/">
            <HomeIcon className="size-5 text-green-600" />
            <span className="hidden lg:inline">Home</span>
          </Link>
        </Button>

        {user ? (
          <>
            <Button
              variant="ghost"
              className=" border flex items-center gap-2"
              asChild
            >
              <Link href="/notifications">
                <BellIcon className="size-5 text-sky-600" />
                <span className="hidden lg:inline">Notifications</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className=" border flex items-center gap-2"
              asChild
            >
              <Link
                href={`/profile/${
                  user.username ??
                  user.emailAddresses[0].emailAddress.split("@")[0]
                }`}
              >
                <UserIcon className="size-5" />
                <span className="hidden lg:inline">Profile</span>
              </Link>
            </Button>
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </>
  );
}

export default DeskTopNavbar;
