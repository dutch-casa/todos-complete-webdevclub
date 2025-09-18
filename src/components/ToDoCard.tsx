/**
 * TODO CARD COMPONENT - Clean and Type-Safe
 *
 * What this demonstrates:
 * - PROPS PATTERN: Clean interface with proper TypeScript types
 * - SINGLE RESPONSIBILITY: Only responsible for displaying a todo
 * - COMPOSITION: Uses smaller UI components to build complex UI
 * - EVENT DELEGATION: Passes events up to parent components
 *
 * Notice how simple this component is now - it just receives a todo
 * and some callback functions, and focuses purely on presentation!
 */

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
import { Pencil, Trash2, MoreVertical, Eye, Calendar } from "lucide-react";
import { Todo } from "@/types/Todo";

/**
 * Component props with proper TypeScript types
 */
interface ToDoCardProps {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Truncate text for display
 */
const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

export default function ToDoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: ToDoCardProps) {
  const isCompleted = todo.completed;

  return (
    <Card className="flex items-center p-4 space-x-4 w-full hover:shadow-md transition-shadow">
      {/* Completion checkbox */}
      <Checkbox
        checked={isCompleted}
        onCheckedChange={onToggle}
        aria-label={`Mark "${todo.title}" as ${
          isCompleted ? "incomplete" : "complete"
        }`}
      />

      {/* Todo content */}
      <div className="flex-1 min-w-0">
        {" "}
        {/* min-w-0 allows text truncation */}
        <h3
          className={`font-semibold transition-all ${
            isCompleted
              ? "line-through text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {todo.title}
        </h3>
        {/* Description */}
        {todo.description && (
          <p
            className={`text-sm mt-1 transition-all ${
              isCompleted
                ? "line-through text-gray-300"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {truncateText(todo.description, 60)}
          </p>
        )}
        {/* Timestamp */}
        <div className="flex items-center mt-2 text-xs text-gray-400 space-x-2">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDate(todo.createdAt)}</span>
          {todo.updatedAt > todo.createdAt && (
            <span>• Updated {formatDate(todo.updatedAt)}</span>
          )}
        </div>
      </div>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for "${todo.title}"`}
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          {/* View full details */}
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle
                  className={isCompleted ? "line-through text-gray-400" : ""}
                >
                  {todo.title}
                </DialogTitle>
                {todo.description && (
                  <DialogDescription
                    className={`mt-2 whitespace-pre-wrap ${
                      isCompleted ? "line-through text-gray-300" : ""
                    }`}
                  >
                    {todo.description}
                  </DialogDescription>
                )}

                {/* Full timestamp info */}
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <div>Created: {todo.createdAt.toLocaleString()}</div>
                  <div>Updated: {todo.updatedAt.toLocaleString()}</div>
                  <div>Status: {isCompleted ? "Completed" : "Pending"}</div>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Edit action */}
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>

          {/* Delete action */}
          <DropdownMenuItem
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
