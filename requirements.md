# Clean Architecture Todo App

## Overview
This Todo application demonstrates **clean, beginner-friendly** software architecture using simple but effective design patterns. Built as an educational tool for teaching React/Next.js best practices without over-engineering.

## Architectural Goals
- **Simplicity First**: Easy to understand patterns that solve real problems
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Type Safety**: TypeScript without complexity 
- **Educational Value**: Extensive comments explaining why patterns are useful
- **The "Clever Abstraction"**: Make complex operations feel like simple function calls

## Simple & Clean Architecture

```
📁 src/
├── 📁 types/           # TypeScript interfaces (the contracts)
│   └── Todo.ts         # What todos look like
├── 📁 services/        # Business logic (the brain)  
│   └── TodoService.ts  # All todo operations
├── 📁 hooks/           # React integration (the magic)
│   └── useTodos.ts     # The "clever abstraction"
└── 📁 components/      # UI components (the face)
    ├── ToDoCompose.tsx # Main component
    ├── TodoInput.tsx   # Create todos
    └── ToDoCard.tsx    # Display todos
```

**The Magic Flow:**
1. Component calls `createTodo()` 
2. Hook validates and calls service
3. Service saves to localStorage
4. Hook updates React state
5. Component automatically re-renders ✨

## Design Patterns Implementation

### 1. Repository Pattern
**Purpose**: Abstract data access logic from business logic
**Location**: `src/domain/repositories/TodoRepository.ts` (interface)
**Implementation**: `src/infrastructure/repositories/` (concrete adapters)

### 2. Factory Pattern  
**Purpose**: Create domain objects with proper validation and defaults
**Location**: `src/domain/factories/TodoFactory.ts`

### 3. Command Pattern
**Purpose**: Encapsulate requests as objects for undo/redo functionality
**Location**: `src/application/commands/`

### 4. Observer Pattern (via React Context)
**Purpose**: Notify multiple components of state changes
**Location**: `src/presentation/contexts/TodoContext.tsx`

### 5. Strategy Pattern
**Purpose**: Allow switching between different storage strategies
**Location**: `src/infrastructure/storage/StorageStrategy.ts`

### 6. Value Objects
**Purpose**: Ensure data integrity and encapsulate validation
**Location**: `src/domain/value-objects/`

### 7. Entity Pattern
**Purpose**: Model business concepts with identity and lifecycle
**Location**: `src/domain/entities/Todo.ts`

### 8. Dependency Injection
**Purpose**: Reduce coupling and improve testability
**Implementation**: Via React Context providers

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
├── presentation/                 # UI Layer (React Components)
│   ├── components/              # UI Components
│   ├── contexts/               # React Context Providers
│   ├── hooks/                  # Custom React Hooks
│   └── pages/                  # Page-specific components
├── application/                 # Application Layer (Use Cases)
│   ├── commands/               # Command handlers
│   ├── queries/                # Query handlers
│   └── services/               # Application services
├── domain/                      # Core Business Logic
│   ├── entities/               # Domain entities
│   ├── value-objects/          # Value objects
│   ├── repositories/           # Repository interfaces (ports)
│   ├── factories/              # Object creation
│   └── services/               # Domain services
└── infrastructure/              # External Concerns
    ├── repositories/           # Repository implementations (adapters)
    ├── storage/                # Storage strategies
    └── config/                 # Configuration
```

## Key Benefits of This Architecture

1. **Business Logic Independence**: Core todo logic doesn't depend on React, localStorage, or any external framework
2. **Easy Testing**: Can test business rules without mounting React components
3. **Flexible Storage**: Can easily switch from localStorage to IndexedDB, REST API, or any other storage mechanism
4. **Component Reusability**: UI components receive pure functions and data, making them highly reusable
5. **Type Safety**: Full TypeScript support with proper domain modeling
6. **Educational Value**: Clear examples of professional software design patterns

## Learning Objectives

Students will learn:
- How to separate business logic from presentation logic
- When and why to use specific design patterns
- How to structure a professional React application
- The importance of abstractions and interfaces
- How to make code testable and maintainable
- Modern TypeScript practices with React

## Future Extensions

This architecture easily supports:
- Backend API integration
- Real-time collaborative editing
- Advanced filtering and search
- Offline-first capabilities  
- Multi-user support
- Audit trails and change history
