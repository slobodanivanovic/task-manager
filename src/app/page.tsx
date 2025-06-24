// src/app/page.tsx - FIXED VERSION WITH SAFETY CHECKS
import { supabase } from "@/lib/supabase";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

// Define the Task interface
interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high" | null;
  created_at: string;
  updated_at: string;
}

// Server Component - data fetched on the server
export default async function HomePage() {
  // Fetch tasks from Supabase (runs on server)
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  // Helper function to get priority colors - WITH SAFETY CHECKS
  const getPriorityColor = (priority: string | null | undefined) => {
    // Safety check - handle null/undefined
    if (!priority) {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper function to format priority text - WITH SAFETY CHECKS
  const formatPriority = (priority: string | null | undefined) => {
    if (!priority) return "None";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Helper function to format date - WITH SAFETY CHECKS
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Safe task counting with null checks
  const safeTaskCount = tasks?.length || 0;
  const completedCount =
    tasks?.filter((task) => task && task.completed === true).length || 0;
  const pendingCount =
    tasks?.filter((task) => task && task.completed === false).length || 0;
  const highPriorityCount =
    tasks?.filter((task) => task && task.priority === "high").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Task Manager Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your tasks with Next.js + Supabase
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {safeTaskCount}
                </div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">
                Error loading tasks: {error.message}
              </span>
            </div>
          </div>
        )}

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Tasks</h2>
            <p className="text-gray-600 text-sm mt-1">
              Data fetched from Supabase PostgreSQL database
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {!tasks || tasks.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500">
                  Add some tasks in your Supabase database to see them here.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task: Task) => {
                    // Safety check for each task
                    if (!task) return null;

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {task.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                            <span
                              className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                                task.completed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {task.completed ? "Done" : "Pending"}
                            </span>
                          </div>
                        </td>

                        {/* Task Column */}
                        <td className="px-6 py-4">
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                task.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.title || "Untitled Task"}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-500 mt-1">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Priority Column - WITH SAFETY CHECKS */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                          >
                            {formatPriority(task.priority)}
                          </span>
                        </td>

                        {/* Created Date Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(task.created_at)}
                        </td>

                        {/* ID Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">
                          #{task.id || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {tasks && tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {highPriorityCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            🚀 How This Works
          </h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>
              • <strong>Server-Side Rendering:</strong> Data fetched on the
              server for SEO and performance
            </li>
            <li>
              • <strong>Supabase Integration:</strong> Real PostgreSQL database
              with real-time capabilities
            </li>
            <li>
              • <strong>Automatic Deployment:</strong> Every git push updates
              this live site
            </li>
            <li>
              • <strong>Global CDN:</strong> Served from the edge closest to
              your users
            </li>
            <li>
              • <strong>Error Handling:</strong> Safe handling of null/undefined
              database values
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
