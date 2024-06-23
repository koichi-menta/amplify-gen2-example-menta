"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect, useState } from "react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

type TodoFormProps = {
  todo: Schema["Todo"]["type"];
  handleUpdate: (string: string) => void;
  handleDelete: () => void;
};
const TodoForm = ({ todo, handleUpdate, handleDelete }: TodoFormProps) => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    setInput(todo.content || "");
  }, []);

  return (
    <div className="flex">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-1">
        <button
          onClick={() => handleUpdate(input)}
          className="border-[1px] border-gray-500 px-2"
        >
          更新
        </button>
        <button
          onClick={handleDelete}
          className="border-[1px] border-gray-500 px-2"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [input, setInput] = useState<string>("");

  const handleGetTodos = async () => {
    const { data: todos } = await client.models.Todo.list();
    setTodos(todos);
  };

  const handleCreate = async () => {
    await client.models.Todo.create({
      content: input,
    });
    setInput("");
    await handleGetTodos();
  };

  const handleDelete = async (id: string) => {
    await client.models.Todo.delete({
      id,
    });
    handleGetTodos();
  };

  const handleUpdate = async (id: string, content: string) => {
    await client.models.Todo.update({
      id,
      content,
    });
  };

  useEffect(() => {
    (async () => {
      await handleGetTodos();
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-5">
      <div className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="border-[1px] border-gray-500 px-2 "
        >
          登録
        </button>
      </div>
      {todos.map((todo) => {
        return (
          <div key={todo.id}>
            <TodoForm
              todo={todo}
              handleUpdate={(content) => handleUpdate(todo.id, content)}
              handleDelete={() => handleDelete(todo.id)}
            />
          </div>
        );
      })}
    </main>
  );
}
