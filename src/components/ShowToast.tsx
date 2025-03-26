"use client";

import { toast } from "sonner";

interface IToastProps {
  message: string;
  type?: "success" | "error";
}

const showToast = ({ message, type = "success" }: IToastProps) => {
  const styles = {
    success: {
      background: "rgb(34, 197, 94)", // Tailwind bg-green-500
      color: "white",
      border: "2px solid rgb(34, 197, 94)", // Tailwind border-green-600
      borderRadius: "8px",
      fontWeight: "bold",
    },
    error: {
      background: "rgb(239, 68, 68)", // Tailwind bg-red-500
      color: "white",
      border: "2px solid rgb(220, 38, 38)", // Tailwind border-red-600
      borderRadius: "8px",
      fontWeight: "bold",
    },
  };

  toast[type](message, { style: styles[type] });
};

export default showToast;
