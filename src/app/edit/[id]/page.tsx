/**
 * EDIT TODO PAGE - Clean Architecture in Action
 *
 * What this demonstrates:
 * - Using our custom hook for data fetching and updates
 * - Clean error handling and loading states
 * - Type-safe component with proper TypeScript
 * - Separation of concerns - page focuses on UI, hook handles data
 *
 * Notice how the component doesn't need to know about storage,
 * services, or complex state management - the hook abstracts it all!
 */

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import { UpdateTodoData } from "@/types/Todo";

/**
 * Loading skeleton for better UX
 */
function EditSkeleton() {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="p-4 space-y-4 border rounded-lg bg-white shadow">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function EditTodo() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Local form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Use our magic hook to get todo data and operations
  const { todos, loading, error, updateTodo } = useTodos();

  // Find the specific todo we're editing
  const todoToEdit = todos.find((todo) => todo.id === id);

  /**
   * Load todo data into form when component mounts or todo data changes
   */
  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description);
    }
  }, [todoToEdit]);

  /**
   * Handle saving changes
   */
  const handleSave = async () => {
    setFormError("");

    // Client-side validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError("Title is required");
      return;
    }

    if (trimmedTitle.length > 200) {
      setFormError("Title is too long (max 200 characters)");
      return;
    }

    try {
      setIsSubmitting(true);

      // Use our hook's update function - so simple!
      const updateData: UpdateTodoData = {
        title: trimmedTitle,
        description: description.trim(),
      };

      await updateTodo(id, updateData);

      // Navigate back to home on success
      router.push("/");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to update todo"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel - go back without saving
   */
  const handleCancel = () => {
    router.push("/");
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  // Show loading state
  if (loading) {
    return <EditSkeleton />;
  }

  // Show error if failed to load todos
  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="p-4 space-y-4 border rounded-lg bg-white shadow">
          <div className="text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error if todo not found
  if (!todoToEdit) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="p-4 space-y-4 border rounded-lg bg-white shadow">
          <div className="text-center">
            <div className="text-red-500 mb-4 text-6xl font-black">404</div>
            <div className="text-gray-600 mb-4">Todo not found</div>
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="p-4 space-y-4 border rounded-lg bg-white shadow">
        {/* Header with back button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold">Edit Todo</h2>
        </div>

        {/* Form error display */}
        {formError && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {formError}
          </div>
        )}

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
              maxLength={200}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <div className="text-xs text-gray-500 mt-1">
              {title.length}/200 characters
            </div>
          </div>

          {/* Description input */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details (optional)"
              disabled={isSubmitting}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <div className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Todo metadata */}
        <div className="text-xs text-gray-400 border-t pt-3 space-y-1">
          <div>Created: {todoToEdit.createdAt.toLocaleString()}</div>
          <div>Last updated: {todoToEdit.updatedAt.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
