import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader, Trash2Icon, TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface IDeleteDialogProps {
  title: string;
  description?: string;
  isDeleting?: boolean;
  onDelete: () => Promise<void>;
}
function DeleteDialog({
  title,
  description,
  isDeleting,
  onDelete,
}: IDeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-300 -mr-2"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Trash2Icon className="size-5" />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-md border border-red-500 max-w-sm md:max-w-md w-full px-6 py-5 sm:px-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-light text-lg sm:text-xl text-left">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:ring-2 hover:ring-gray-500 transition-all duration-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={onDelete}
            className="text-white bg-red-500 hover:ring-2 hover:bg-red-600 hover:ring-red-500 transition-all duration-200"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                Deleting...
                <Loader className="size-4 animate-spin" />
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDialog;
