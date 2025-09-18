/**
 * SERVICE LAYER PATTERN
 * 
 * What this is: A class that handles all the business logic for todos.
 * Instead of putting this logic in components, we keep it separate.
 * 
 * Why we use this pattern:
 * - Components stay focused on UI rendering
 * - Business logic is reusable across different components
 * - Easy to test business logic without rendering components
 * - Changes to business rules don't require touching UI code
 * 
 * In our todo app: This is where we handle creating, updating, deleting todos,
 * plus any business rules (like generating IDs, validation, etc.)
 */

import { Todo, CreateTodoData, UpdateTodoData, TodoStorageData, TodoFilters } from '@/types/Todo';

export class TodoService {
  private static readonly STORAGE_KEY = 'todos-app-data';

  /**
   * FACTORY METHOD PATTERN - Create a new todo with all the required fields
   */
  private static createTodoObject(data: CreateTodoData): Todo {
    const now = new Date();
    return {
      id: crypto.randomUUID(), // Browser-native UUID generation
      title: data.title.trim(),
      description: data.description?.trim() || '',
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Convert stored data back to proper Todo objects
   * (converts date strings back to Date objects)
   */
  private static fromStorage(stored: TodoStorageData): Todo {
    return {
      ...stored,
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
    };
  }

  /**
   * Convert Todo to storage format (dates become strings)
   */
  private static toStorage(todo: Todo): TodoStorageData {
    // Ensure dates exist and are valid Date objects
    const createdAt = todo.createdAt instanceof Date ? todo.createdAt : new Date();
    const updatedAt = todo.updatedAt instanceof Date ? todo.updatedAt : new Date();
    
    return {
      ...todo,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }

  /**
   * Get all todos from localStorage
   */
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const storageData: TodoStorageData[] = JSON.parse(stored);
      return storageData.map(this.fromStorage);
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  /**
   * Save all todos to localStorage
   */
  private static async saveTodos(todos: Todo[]): Promise<void> {
    try {
      const storageData = todos.map(this.toStorage);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Error saving todos:', error);
      throw new Error('Failed to save todos');
    }
  }

  /**
   * Create a new todo
   */
  static async createTodo(data: CreateTodoData): Promise<Todo> {
    // Input validation
    if (!data.title?.trim()) {
      throw new Error('Todo title is required');
    }

    const newTodo = this.createTodoObject(data);
    const todos = await this.getAllTodos();
    todos.push(newTodo);
    await this.saveTodos(todos);
    
    return newTodo;
  }

  /**
   * Update an existing todo
   */
  static async updateTodo(id: string, updates: UpdateTodoData): Promise<Todo> {
    const todos = await this.getAllTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo: Todo = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date(),
    };

    todos[todoIndex] = updatedTodo;
    await this.saveTodos(todos);
    
    return updatedTodo;
  }

  /**
   * Toggle a todo's completion status
   */
  static async toggleTodo(id: string): Promise<Todo> {
    const todos = await this.getAllTodos();
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      throw new Error('Todo not found');
    }

    return this.updateTodo(id, { completed: !todo.completed });
  }

  /**
   * Delete a todo
   */
  static async deleteTodo(id: string): Promise<boolean> {
    const todos = await this.getAllTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    
    if (filteredTodos.length === todos.length) {
      return false; // Todo wasn't found
    }

    await this.saveTodos(filteredTodos);
    return true;
  }

  /**
   * Delete all completed todos
   */
  static async deleteCompleted(): Promise<number> {
    const todos = await this.getAllTodos();
    const completedCount = todos.filter(todo => todo.completed).length;
    const activeTodos = todos.filter(todo => !todo.completed);
    
    await this.saveTodos(activeTodos);
    return completedCount;
  }

  /**
   * Filter todos based on criteria
   */
  static async getFilteredTodos(filters: TodoFilters): Promise<Todo[]> {
    const todos = await this.getAllTodos();
    
    return todos.filter(todo => {
      // Filter by completion status
      if (filters.completed !== undefined && todo.completed !== filters.completed) {
        return false;
      }
      
      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDescription = todo.description.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Get todo statistics
   */
  static async getStats(): Promise<{ total: number; completed: number; pending: number }> {
    const todos = await this.getAllTodos();
    const completed = todos.filter(todo => todo.completed).length;
    
    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    };
  }
}
