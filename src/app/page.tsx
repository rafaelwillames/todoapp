import type { Task } from "@/types/task";

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Set up the project structure",
    description: "Next.js with TypeScript and Tailwind.",
    status: "done",
    priority: "high",
    createdAt: "2026-07-21T00:00:00.000Z",
    updatedAt: "2026-07-21T00:00:00.000Z",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">TodoAPP</h1>
      <p className="mt-2 text-sm opacity-70">
        Task management built with Next.js, TypeScript and Tailwind.
      </p>

      <ul className="mt-8 space-y-3">
        {sampleTasks.map((task) => (
          <li
            key={task.id}
            className="rounded-lg border border-black/10 p-4 dark:border-white/15"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{task.title}</span>
              <span className="rounded bg-black/5 px-2 py-0.5 text-xs uppercase dark:bg-white/10">
                {task.status}
              </span>
            </div>
            {task.description ? (
              <p className="mt-1 text-sm opacity-70">{task.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
