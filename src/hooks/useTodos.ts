/**
 * CUSTOM HOOK PATTERN - The "Clever Abstraction"
 * 
 * What this is: A custom React hook that provides all todo operations as simple functions.
 * From the component's perspective, it's like having local functions that magically
 * handle all the complexity of storage, state management, and data consistency.
 * 
 * Why this is awesome:
 * - Components don't need to know about services or storage
 * - All todo operations feel like calling simple local functions
 * - Automatic state management and re-rendering
 * - One place to handle loading states and errors
 * - Easy to swap out the backend implementation later
 * 
 * In our todo app: This is the magic layer that makes everything "just work"
 */

import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoData, UpdateTodoData, TodoFilters } from '@/types/Todo';
import { TodoService } from '@/services/TodoService';

/**
 * The return type of our custom hook - everything a component needs
 */
interface UseTodosReturn {
  // State
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  // Actions (these feel like local functions to components!)
  createTodo: (data: CreateTodoData) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoData) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  deleteCompleted: () => Promise<void>;
  
  // Utilities
  refreshTodos: () => Promise<void>;
  getStats: () => { total: number; completed: number; pending: number };
}

/**
 * The magic hook that makes todo operations feel effortless
 */
export const useTodos = (filters?: TodoFilters): UseTodosReturn => {
  // Internal state management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load todos from storage (with optional filtering)
   */
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedTodos = filters 
        ? await TodoService.getFilteredTodos(filters)
        : await TodoService.getAllTodos();
      
      setTodos(loadedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Load todos when the hook is first used or filters change
   */
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  /**
   * Create a new todo
   * Components just call this like a normal function!
   */
  const createTodo = useCallback(async (data: CreateTodoData) => {
    try {
      setError(null);
      await TodoService.createTodo(data);
      await loadTodos(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err; // Let the component handle it if needed
    }
  }, [loadTodos]);

  /**
   * Update an existing todo
   */
  const updateTodo = useCallback(async (id: string, updates: UpdateTodoData) => {
    try {
      setError(null);
      await TodoService.updateTodo(id, updates);
      await loadTodos(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  }, [loadTodos]);

  /**
   * Toggle todo completion status
   */
  const toggleTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await TodoService.toggleTodo(id);
      await loadTodos(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      throw err;
    }
  }, [loadTodos]);

  /**
   * Delete a specific todo
   */
  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      const wasDeleted = await TodoService.deleteTodo(id);
      
      if (!wasDeleted) {
        throw new Error('Todo not found');
      }
      
      await loadTodos(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  }, [loadTodos]);

  /**
   * Delete all completed todos
   */
  const deleteCompleted = useCallback(async () => {
    try {
      setError(null);
      await TodoService.deleteCompleted();
      await loadTodos(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete completed todos');
      throw err;
    }
  }, [loadTodos]);

  /**
   * Calculate stats from current todos
   */
  const getStats = useCallback(() => {
    const completed = todos.filter(todo => todo.completed).length;
    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    };
  }, [todos]);

  /**
   * Refresh todos manually (useful for pull-to-refresh or error recovery)
   */
  const refreshTodos = useCallback(async () => {
    await loadTodos();
  }, [loadTodos]);

  return {
    // State
    todos,
    loading,
    error,
    
    // Actions that feel like magic to components!
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    
    // Utilities
    refreshTodos,
    getStats,
  };
};
