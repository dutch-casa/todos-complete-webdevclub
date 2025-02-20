"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useTodosStorage } from "@/hooks/use-todos-storage";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTodo() {
  const router = useRouter();
  const { id } = useParams();
  const [todos, setTodos] = useTodosStorage();
  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load the todo from storage
  useEffect(() => {
    if (!id) return;
    const todoToEdit = todos.find((t) => t.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit);
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description);
    } else {
      return;
    }
  }, [id, todos]);

  // Save changes
  const handleSave = () => {
    if (!title.trim()) return;
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, title, description } : t
    );
    setTodos(updatedTodos);
    router.push("/"); // ✅ Redirects back to home
  };

  if (!todo)
    return (
      <div className="max-w-md mx-auto p-4">
        <Card className="p-4 space-y-4">
          <div className="flex justify-center items-center font-black text-red-600 text-6xl">
            ERROR
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Button onClick={() => router.push("/")} className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Edit Todo</h2>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </Card>
    </div>
  );
}
