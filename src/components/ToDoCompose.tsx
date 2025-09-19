/**
 * MAIN TODO COMPONENT - Now Much Cleaner!
 *
 * What changed: Instead of managing complex state logic, this component
 * just uses our custom hook and gets simple functions that "just work".
 *
 * Benefits of the new approach:
 * - Component focuses only on UI rendering
 * - Business logic is handled by the service layer
 * - Custom hook provides a clean, simple API
 * - Easy to test and maintain
 * - Type safety with TypeScript
 *
 * Notice how much simpler this is compared to the old version!
 */

"use client";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import TodoInput from "@/components/TodoInput";
import TodoActions from "@/components/TodoActions";
import ToDoCard from "@/components/ToDoCard";
import { useTodos } from "@/hooks/useTodos";
import { CreateTodoData } from "@/types/Todo";

/**
 * Loading component for better UX
 */
function TodoSkeleton() {
  return (
    <div className="p-4 space-y-4 w-full max-w-sm mx-auto">
      <div className="h-32 bg-gray-200 rounded animate-pulse" />
      <div className="h-16 bg-gray-100 rounded animate-pulse" />
      <div className="h-16 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

export default function TodoApp() {
  const router = useRouter();

  // This is the magic! One hook gives us everything we need
  const {
    todos,
    loading,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    getStats,
  } = useTodos();

  /**
   * Handle creating a new todo - just call the function!
   */
  const handleCreateTodo = async (data: CreateTodoData) => {
    try {
      await createTodo(data);
      // That's it! The hook handles all the complexity
    } catch (err) {
      // Handle error in UI if needed
      console.error("Failed to create todo:", err);
    }
  };

  /**
   * Handle toggling todo completion
   */
  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
      // So simple! No state management needed
    } catch (err) {
      console.error("Failed to toggle todo:", err);
    }
  };

  /**
   * Handle deleting a todo
   */
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  /**
   * Handle deleting completed todos
   */
  const handleDeleteCompleted = async () => {
    try {
      await deleteCompleted();
    } catch (err) {
      console.error("Failed to delete completed todos:", err);
    }
  };

  /**
   * Navigate to edit page
   */
  const handleEditTodo = (id: string) => {
    router.push(`/edit/${id}`);
  };

  // Performance optimization: memoize stats calculation (must be before early returns)
  const stats = useMemo(() => getStats(), [getStats]);

  // Show loading state
  if (loading) {
    return <TodoSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats display */}
      {stats.total > 0 && (
        <div className="text-center text-sm text-gray-500">
          {stats.total} total • {stats.completed} completed • {stats.pending}{" "}
          pending
        </div>
      )}

      <div className="p-4 space-y-4 w-full max-w-sm mx-auto">
        {/* Todo input form */}
        <TodoInput onAdd={handleCreateTodo} />

        {/* Todo actions - separate component for better separation of concerns */}
        <TodoActions
          onDeleteCompleted={handleDeleteCompleted}
          completedCount={stats.completed}
        />

        {/* Todo list */}
        {todos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No todos yet. Create your first one above!
          </div>
        ) : (
          todos.map((todo) => (
            <ToDoCard
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggleTodo(todo.id)}
              onEdit={() => handleEditTodo(todo.id)}
              onDelete={() => handleDeleteTodo(todo.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
