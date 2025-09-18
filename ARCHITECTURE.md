# Clean Architecture Todo App

## What This Project Teaches

This is a **beginner-friendly** example of how to structure a React/Next.js app using clean architecture principles and design patterns. It's designed to be educational while still being practical.

## The "Clever Abstraction" 

The magic of this app is the `useTodos` custom hook. From a component's perspective, managing todos feels like calling simple local functions:

```jsx
const { todos, createTodo, updateTodo, deleteTodo } = useTodos();

// Creating a todo feels effortless!
await createTodo({ title: "Learn React patterns" });
```

Behind the scenes, this handles:
- ✅ State management
- ✅ Data validation  
- ✅ Persistence to localStorage
- ✅ Error handling
- ✅ Loading states
- ✅ Automatic re-renders

## Architecture Overview

```
📁 src/
├── 📁 types/           # TypeScript interfaces (the contracts)
├── 📁 services/        # Business logic (the brain)
├── 📁 hooks/           # React integration (the magic)
└── 📁 components/      # UI components (the face)
```

## Design Patterns Used

### 1. **Custom Hook Pattern** 
- **File**: `hooks/useTodos.ts`
- **What it does**: Provides a simple API for todo operations
- **Why it's awesome**: Components don't need to know about storage, services, or complex state management

### 2. **Service Layer Pattern**
- **File**: `services/TodoService.ts`  
- **What it does**: Contains all business logic for todos
- **Why it's useful**: Keeps business rules separate from UI, easy to test

### 3. **TypeScript Interfaces**
- **File**: `types/Todo.ts`
- **What it does**: Defines the shape of our data
- **Why it helps**: Catches errors at compile time, provides auto-completion

### 4. **Separation of Concerns**
- **UI Components**: Only handle rendering and user interaction
- **Custom Hook**: Manages state and provides simple functions
- **Service Layer**: Handles business logic and data operations
- **Types**: Define contracts and ensure type safety

## Key Benefits for Students

1. **Components are Simple**: They just call functions and render UI
2. **Type Safety**: TypeScript catches errors before runtime
3. **Easy Testing**: Business logic is separated from UI
4. **Maintainable**: Each piece has a single responsibility
5. **Scalable**: Easy to add new features or change storage mechanisms

## How Data Flows

1. **User Action** → Component calls hook function
2. **Hook** → Calls service method
3. **Service** → Validates data, updates storage
4. **Hook** → Updates React state  
5. **Component** → Automatically re-renders with new data

## What Makes This Beginner-Friendly

- **No over-engineering**: We use patterns that solve real problems
- **Clear separation**: Each file has one job and does it well
- **Extensive comments**: Every pattern is explained
- **TypeScript**: Provides safety without complexity
- **Modern practices**: Uses current React best practices

## Try It Out

1. Add a todo - notice how simple the code is
2. Edit a todo - the state management "just works"
3. Delete completed todos - bulk operations are easy
4. Look at the code - see how clean the separation is

The goal is to show you that good architecture doesn't have to be complicated - it just needs to be thoughtful!
