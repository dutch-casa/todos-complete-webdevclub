/**
 * TODO ACTIONS COMPONENT - Clean Separation of Concerns
 *
 * This component handles todo actions like "Delete Completed" separately
 * from the TodoInput form, following the Single Responsibility Principle.
 *
 * Benefits:
 * - TodoInput focuses only on input logic
 * - TodoActions handles action buttons
 * - Better reusability and testability
 * - Props are simple values, not functions
 */

"use client";

interface TodoActionsProps {
  onDeleteCompleted: () => Promise<void>;
  completedCount: number;
  isDisabled?: boolean;
}

export default function TodoActions({
  onDeleteCompleted,
  completedCount,
  isDisabled = false,
}: TodoActionsProps) {
  const handleDeleteCompleted = async () => {
    try {
      await onDeleteCompleted();
    } catch (err) {
      console.error("Failed to delete completed todos:", err);
      // Could add toast notification here
    }
  };

  // Don't render anything if no completed todos
  if (completedCount === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleDeleteCompleted}
      className="w-full py-2 text-md font-bold bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
      disabled={isDisabled}
    >
      Delete Completed ({completedCount})
    </button>
  );
}
