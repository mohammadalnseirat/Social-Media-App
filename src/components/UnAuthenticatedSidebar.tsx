"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const UnAuthenticatedSidebar = () => {
  const letters = Array.from("Welcome Back!");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };
  return (
    <div className="sticky top-20">
      <div className="relative">
        {/* Animated border effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-xl border-2 border-transparent"
          style={{
            background:
              "linear-gradient(to right, #7c3aed, #ec4899) border-box",
            WebkitMask:
              "linear-gradient(white, white) padding-box, linear-gradient(white, white) border-box",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{
            background: [
              "linear-gradient(to right, #7c3aed, #ec4899) border-box",
              "linear-gradient(to right, #3b82f6, #10b981) border-box",
              "linear-gradient(to right, #f59e0b, #ef4444) border-box",
              "linear-gradient(to right, #7c3aed, #ec4899) border-box",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <Card className=" shadow-sm">
          <CardHeader>
            <CardTitle>
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className={`flex items-center justify-center overflow-hidden text-green-600  hover:text-green-700 transition-colors duration-200 cursor-pointer`}
              >
                {letters.map((letter, index) => (
                  <motion.span
                    variants={child}
                    key={index}
                    className="text-2xl font-bold text-center"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Login to access your profile and connect with others.
            </p>
            <SignInButton mode="modal">
              <Button className="w-full" variant={"outline"}>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-full mt-2" variant={"default"}>
                Sign Up
              </Button>
            </SignUpButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnAuthenticatedSidebar;
