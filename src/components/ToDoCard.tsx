/**
 * TODO CARD COMPONENT - Simple and Clean
 *
 * What this demonstrates:
 * - PROPS PATTERN: Clean interface with proper TypeScript types
 * - SINGLE RESPONSIBILITY: Only responsible for displaying a todo
 * - NO COMPLEX UI LIBRARIES: Uses plain HTML for better learning
 * - EVENT DELEGATION: Passes events up to parent components
 *
 * This simplified version focuses on teaching core React patterns
 * without getting caught up in complex UI library TypeScript issues.
 */

"use client";
import { useState } from "react";
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
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const isCompleted = todo.completed;

  return (
    <div className="flex items-center p-4 space-x-4 w-full hover:shadow-md transition-shadow border rounded-lg bg-white relative">
      {/* Completion checkbox */}
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={onToggle}
        aria-label={`Mark "${todo.title}" as ${
          isCompleted ? "incomplete" : "complete"
        }`}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />

      {/* Todo content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
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
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          aria-label={`Actions for "${todo.title}"`}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {/* Simple dropdown menu */}
        {showActions && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setShowDetails(true);
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>

            <button
              onClick={() => {
                onEdit();
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </button>

            <button
              onClick={() => {
                onDelete();
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Details modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h2
                className={`text-xl font-semibold ${
                  isCompleted ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </h2>
              {todo.description && (
                <p
                  className={`mt-2 whitespace-pre-wrap ${
                    isCompleted ? "line-through text-gray-300" : "text-gray-600"
                  }`}
                >
                  {todo.description}
                </p>
              )}
            </div>

            {/* Full timestamp info */}
            <div className="mb-4 text-sm text-gray-500 space-y-1 border-t pt-3">
              <div>Created: {todo.createdAt.toLocaleString()}</div>
              <div>Updated: {todo.updatedAt.toLocaleString()}</div>
              <div>Status: {isCompleted ? "Completed" : "Pending"}</div>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showActions || showDetails) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowActions(false);
            setShowDetails(false);
          }}
        />
      )}
    </div>
  );
}
