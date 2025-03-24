"use client";

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { BellIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";

function MobileNavbar() {
  const { isSignedIn } = useAuth();

  return (
    <div className="fixed bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 bottom-0 left-0 w-full bg-white shadow-lg p-2 flex justify-between md:hidden border-t">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/" className="p-2 flex flex-col items-center">
            <HomeIcon className="size-6 text-green-600" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Home</TooltipContent>
      </Tooltip>
      {/* Mode Toggle (Light/Dark) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <ModeToggle />
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>

      {isSignedIn ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/notifications"
                className="p-2 flex flex-col items-center"
              >
                <BellIcon className="size-6 text-sky-600" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/profile`}
                className="p-2 flex flex-col items-center"
              >
                <UserIcon className="size-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Profile</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <SignOutButton>
                <Button variant="ghost">
                  <LogOutIcon className="w-5 h-5" />
                </Button>
              </SignOutButton>
            </TooltipTrigger>
            <TooltipContent>Sign Out</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="p-2 text-sm">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}

export default MobileNavbar;
