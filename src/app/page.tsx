import type { Task } from "@/types/task";

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Set up the project",
    description: "Initialize Next.js with TypeScript and Tailwind CSS.",
    status: "completed",
    priority: "high",
    createdAt: "2026-07-20T00:00:00.000Z",
    updatedAt: "2026-07-20T00:00:00.000Z",
    completedAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Define the Task type",
    description: "Model the core domain type used across the app.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2026-07-20T00:00:00.000Z",
    updatedAt: "2026-07-20T00:00:00.000Z",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">TodoAPP</h1>
      <p className="mt-2 text-gray-600">
        Initial structure with Next.js, TypeScript and Tailwind CSS.
      </p>

      <ul className="mt-8 space-y-3">
        {sampleTasks.map((task) => (
          <li
            key={task.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{task.title}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs uppercase tracking-wide text-gray-600">
                {task.status}
              </span>
            </div>
            {task.description ? (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
