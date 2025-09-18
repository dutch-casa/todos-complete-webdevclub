/**
 * TYPE DEFINITIONS - Todo Types
 * 
 * What this is: TypeScript interfaces that define the shape of our data.
 * Think of these as contracts that ensure our data has the right structure.
 * 
 * Why we use types:
 * - Catch errors at compile time instead of runtime
 * - Auto-completion in your editor
 * - Self-documenting code
 * - Easier refactoring
 * 
 * In our todo app: Ensures we don't accidentally pass the wrong data around
 */

/**
 * The main Todo interface - this is what a todo looks like in our app
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * What we need to create a new todo (without the system-generated fields)
 */
export interface CreateTodoData {
  title: string;
  description?: string; // Optional - the ? means it might not be there
}

/**
 * What we need to update a todo (all fields optional since you might only update some)
 */
export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * For filtering todos in our UI
 */
export interface TodoFilters {
  completed?: boolean;
  searchQuery?: string;
}

/**
 * The shape of data when we store/retrieve from localStorage
 * (dates become strings when serialized to JSON)
 */
export interface TodoStorageData {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}
