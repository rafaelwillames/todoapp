/**
 * Domain types for the TodoAPP.
 *
 * These define the shape of a Task as used across the UI and future API layer.
 */

/** Lifecycle status of a task. */
export type TaskStatus = "todo" | "in_progress" | "done";

/** Relative priority of a task. */
export type TaskPriority = "low" | "medium" | "high";

/**
 * A single unit of work tracked by the application.
 */
export interface Task {
  /** Unique identifier. */
  id: string;
  /** Short, human-readable summary of what needs to be done. */
  title: string;
  /** Optional longer description with additional context. */
  description?: string;
  /** Current lifecycle status. Defaults to "todo" for new tasks. */
  status: TaskStatus;
  /** Relative priority. Defaults to "medium". */
  priority: TaskPriority;
  /** Optional due date, stored as an ISO 8601 string. */
  dueDate?: string;
  /** Creation timestamp, stored as an ISO 8601 string. */
  createdAt: string;
  /** Last update timestamp, stored as an ISO 8601 string. */
  updatedAt: string;
}

/**
 * Fields accepted when creating a new task. Server-managed fields
 * (id, timestamps) and defaulted fields are omitted or optional.
 */
export type NewTask = Pick<Task, "title"> &
  Partial<Pick<Task, "description" | "status" | "priority" | "dueDate">>;
