"use client";
import { useState, useEffect } from "react";
import { Task } from "@/lib/supabase";
import { Plus, Check, Trash2, Clock } from "lucide-react";

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask,
          priority: "medium",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const task = await response.json();
      setTasks([task, ...tasks]); // ← Now using 'tasks'
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && addTask()} // ← Now using 'addTask'
          />
          <button
            onClick={addTask} // ← Now using 'addTask'
            disabled={loading || !newTask.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? "Adding..." : "Add Task"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tasks yet. Add one above!
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="text-gray-800">{task.title}</span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    task.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.completed ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
