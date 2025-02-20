"use client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreVertical, Eye } from "lucide-react";

export default function ToDoCard({
  id,
  todo,
  onToggle,
  onEdit,
  onConfirmDelete,
}) {
  return (
    <Card className="flex items-center p-4 space-x-4 w-full">
      <Checkbox checked={todo.completed} onCheckedChange={() => onToggle(id)} />
      <div className="flex-1">
        <h3
          className={`font-semibold ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.title}
        </h3>
        <p
          className={`text-sm text-gray-500 truncate ${
            todo.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {todo.description.length <= 20
            ? todo.description
            : todo.description.substring(0, 20) + "..."}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </DropdownMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl rounded">
                  {todo.title}
                </DialogTitle>
                <DialogDescription className="mt-2 whitespace-pre-wrap rounded">
                  {todo.description}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem onClick={onConfirmDelete}>
            <Trash2 className="w-4 h-4 mr-2 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
