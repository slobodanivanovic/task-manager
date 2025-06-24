// app/tasks/page.tsx (SSR Example)
import { supabase } from "@/lib/supabase";

export default async function TasksPage() {
  // This runs on the server
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Tasks (Server-Side Rendered)</h1>
      {tasks?.map((task) => (
        <div key={task.id}>
          {task.title} - {task.completed ? "Done" : "Pending"}
        </div>
      ))}
    </div>
  );
}
