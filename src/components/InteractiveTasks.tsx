"use client";
import { useState, useEffect } from "react";

export default function InteractiveTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        fetchTasks(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return <div>{/* Your interactive UI here */}</div>;
}
