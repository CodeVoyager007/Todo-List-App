"use client"; // Enables client-side rendering for this component

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          dueDate: newTaskDueDate,
        },
      ]);
      setNewTask("");
      setNewTaskDueDate("");
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black relative">
      <div className="w-full max-w-md bg-white border-[#AA0000] border-4 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl hover:border-[#960018]"> 
        <h1 className=" font-bold mb-4 text-black text-center text-2xl">𝒯𝑜𝒹𝑜 𝐿𝒾𝓈𝓉</h1>

        {/* New Task input */}
        <div className="flex flex-col space-y-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-black"
          />
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-black"
          />
          <Button
            onClick={addTask}
            className="bg-[#041E42] hover:bg-[#AA0000] text-white font-medium py-2 px-4 rounded-md"
          >
            Add Task
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col space-y-2 bg-gray-100 rounded-md px-4 py-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    checked={task.completed}
                    className="mr-2"
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  {editingTaskId === task.id ? (
                    <Input
                      type="text"
                      value={editedTaskText}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTaskText(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          updateTask();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-black"
                    />
                  ) : (
                    <span
                      className={`flex-1 text-black ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.text} - Due: {task.dueDate}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {editingTaskId === task.id ? (
                    <Button
                      onClick={updateTask}
                      className="bg-[#041E42] hover:bg-[#006400] text-white font-medium py-1 px-2 rounded-md mr-2"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => startEditingTask(task.id, task.text)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1 px-2 rounded-md mr-2"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tagline */}
      <div className="absolute bottom-4 right-4 text-white font-bold">
        <p>Made with <span className="text-red-900">♥ </span>by Ayesha Mughal</p>
      </div>
    </div>
  );
}
