/**
 * TODO INPUT COMPONENT - Now Type-Safe and Clean!
 * 
 * What changed:
 * - Added TypeScript for better type safety
 * - Cleaner interface with proper types
 * - Better validation and error handling
 * - More professional form handling
 * 
 * Pattern demonstrated: CONTROLLED COMPONENT PATTERN
 * - React controls the form state
 * - Single source of truth for form data
 * - Easy to validate and transform data
 */

"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateTodoData } from "@/types/Todo";

interface TodoInputProps {
  onAdd: (data: CreateTodoData) => Promise<void>;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handle form submission with proper validation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Client-side validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please enter a todo title");
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Title is too long (max 200 characters)");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Call the parent's add function with typed data
      await onAdd({
        title: trimmedTitle,
        description: description.trim() || undefined, // Send undefined if empty
      });
      
      // Clear form on success
      setTitle("");
      setDescription("");
    } catch (err) {
      // Handle error from the service layer
      setError(err instanceof Error ? err.message : "Failed to create todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Enter key press (but allow Shift+Enter for new lines in description)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="p-4 space-y-4 w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center">Add a New Todo</h2>
      
      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title input - required */}
        <div>
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            disabled={isSubmitting}
            maxLength={200}
            required
            aria-label="Todo title"
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/200 characters
          </div>
        </div>

        {/* Description input - optional */}
        <div>
          <Input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            disabled={isSubmitting}
            maxLength={500}
            aria-label="Todo description"
          />
          <div className="text-xs text-gray-500 mt-1">
            {description.length}/500 characters
          </div>
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full py-2 text-md font-bold" 
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Todo"}
        </Button>
      </form>

      {/* Helper text */}
      <div className="text-xs text-gray-400 text-center">
        Press Enter to add, or Shift+Enter for new line in description
      </div>
    </Card>
  );
}
