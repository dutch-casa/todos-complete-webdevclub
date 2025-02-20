import { useState, useEffect } from "react";
import TodoInput from "@/components/TodoInput";
import ToDoCard from "@/components/ToDoCard";
import { useRouter } from "next/navigation";
import DeleteCompleted from "@/components/DeleteCompleted";
import { useTodosStorage } from "@/hooks/use-todos-storage";

export default function TodoApp() {
  const [todos, setTodos] = useTodosStorage();
  const router = useRouter();

  const addTodo = (todo) => {
    setTodos((prev) => {
      const newTodo = {
        ...todo,
        id: todo.id || crypto.randomUUID(),
        completed: false,
      };
      return [...prev, newTodo];
    });
  };

  const deleteCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id) => {
    router.push(`/edit/${id}`);
  };

  return (
    <>
      <div onClick={() => deleteCompleted()}>
        <DeleteCompleted />
      </div>
      <div className="p-4 space-y-4 w-full max-w-sm mx-auto">
        <TodoInput onAdd={addTodo} />
        {todos.map((todo) => (
          <ToDoCard
            key={todo.id}
            id={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={() => editTodo(todo.id)}
            onConfirmDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </div>
    </>
  );
}
