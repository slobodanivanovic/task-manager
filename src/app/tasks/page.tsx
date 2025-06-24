// src/app/tasks/page.tsx - FIXED VERSION WITH SAFETY CHECKS
import { supabase } from "@/lib/supabase";
import { CheckCircle, Clock } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | null;
  created_at: string;
  updated_at: string;
}

export default async function TasksPage() {
  // This runs on the server
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  // Helper function with safety checks
  const formatPriority = (priority: string | null | undefined) => {
    if (!priority) return "None";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Tasks (Server-Side Rendered)
        </h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          Error loading tasks: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks (Server-Side Rendered)</h1>
      <p className="text-gray-600 mb-6">
        This page uses <strong>Server-Side Rendering</strong> - rendered fresh
        on each request with up-to-date data.
      </p>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">All Tasks</h3>

        {!tasks || tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tasks found. Add some tasks in your Supabase database.
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: Task) => {
              // Safety check for each task
              if (!task) return null;

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <span
                        className={
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }
                      >
                        {task.title || "Untitled Task"}
                      </span>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(task.created_at)} | Priority:{" "}
                        {formatPriority(task.priority)}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
