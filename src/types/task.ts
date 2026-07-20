/**
 * Core domain type for the TodoAPP.
 *
 * A `Task` represents a single to-do item tracked by the application.
 * Timestamps are stored as ISO 8601 strings so the type is safe to
 * serialize (e.g. across API boundaries or in the browser).
 */

/** Lifecycle state of a task. */
export type TaskStatus = "pending" | "in_progress" | "completed";

/** Relative importance of a task. */
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  /** Unique identifier for the task. */
  id: string;
  /** Short, human-readable summary of what needs to be done. */
  title: string;
  /** Optional longer description with additional details. */
  description?: string;
  /** Current lifecycle state. */
  status: TaskStatus;
  /** Relative importance used for ordering and highlighting. */
  priority: TaskPriority;
  /** ISO 8601 timestamp of when the task was created. */
  createdAt: string;
  /** ISO 8601 timestamp of the last update. */
  updatedAt: string;
  /** Optional ISO 8601 due date. */
  dueDate?: string;
  /** ISO 8601 timestamp of when the task was completed, if any. */
  completedAt?: string | null;
}

/**
 * Fields required to create a new task. The system is responsible for
 * assigning `id` and the timestamps, so they are omitted here.
 */
export type NewTask = Pick<Task, "title"> &
  Partial<Pick<Task, "description" | "status" | "priority" | "dueDate">>;

/** Fields that may be changed on an existing task. */
export type TaskUpdate = Partial<
  Pick<Task, "title" | "description" | "status" | "priority" | "dueDate" | "completedAt">
>;
