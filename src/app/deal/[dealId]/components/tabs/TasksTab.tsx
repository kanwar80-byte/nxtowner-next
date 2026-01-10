"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Circle, Clock, Calendar, Trash2 } from "lucide-react";
import type { DealTask, TaskStatus } from "@/types/deal";
// Date formatting helpers
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isPast = (date: Date): boolean => {
  return date < new Date();
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

interface TasksTabProps {
  dealId: string;
  tasks: DealTask[];
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function TasksTab({ dealId, tasks: initialTasks }: TasksTabProps) {
  const [tasks, setTasks] = useState<DealTask[]>(initialTasks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // Client-only state management (as per requirements)
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: DealTask = {
      id: `temp-${Date.now()}`,
      deal_id: dealId,
      title: newTaskTitle,
      description: newTaskDescription || null,
      status: "pending",
      due_date: newTaskDueDate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setShowAddForm(false);

    // TODO: Call repository function when wired
    // await createDealTask(dealId, {
    //   title: newTaskTitle,
    //   description: newTaskDescription || undefined,
    //   due_date: newTaskDueDate || undefined,
    // });
  };

  const handleToggleStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus =
      currentStatus === "pending"
        ? "in_progress"
        : currentStatus === "in_progress"
        ? "completed"
        : "pending";

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      )
    );

    // TODO: Call repository function when wired
    // await updateDealTask(taskId, dealId, { status: newStatus });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setTasks(tasks.filter((task) => task.id !== taskId));

    // TODO: Call repository function when wired
    // await deleteDealTask(taskId, dealId);
  };

  const getDueDateDisplay = (dueDate: string | null) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const shortFormat = new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (isPast(date) && !isToday(date)) {
      return { text: `Overdue: ${shortFormat}`, className: "text-red-400" };
    }
    if (isToday(date)) {
      return { text: "Due today", className: "text-orange-400" };
    }
    if (isTomorrow(date)) {
      return { text: "Due tomorrow", className: "text-yellow-400" };
    }
    return { text: `Due ${shortFormat}`, className: "text-slate-400" };
  };

  const groupedTasks = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return (
    <div className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Tasks</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage deal-related tasks
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/20 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Due Date (optional)
            </label>
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
              Create Task
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setNewTaskTitle("");
                setNewTaskDescription("");
                setNewTaskDueDate("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 border border-slate-800 rounded-lg bg-slate-900/20">
          <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No tasks yet</p>
          <p className="text-sm text-slate-500">
            Add tasks to track important deal milestones and actions
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* In Progress */}
          {groupedTasks.in_progress.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                In Progress ({groupedTasks.in_progress.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.in_progress.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteTask}
                    getDueDateDisplay={getDueDateDisplay}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {groupedTasks.pending.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Circle className="w-4 h-4 text-yellow-400" />
                Pending ({groupedTasks.pending.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.pending.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteTask}
                    getDueDateDisplay={getDueDateDisplay}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {groupedTasks.completed.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Completed ({groupedTasks.completed.length})
              </h3>
              <div className="space-y-2">
                {groupedTasks.completed.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteTask}
                    getDueDateDisplay={getDueDateDisplay}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface TaskItemProps {
  task: DealTask;
  onToggleStatus: (taskId: string, currentStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  getDueDateDisplay: (dueDate: string | null) => { text: string; className: string } | null;
}

function TaskItem({ task, onToggleStatus, onDelete, getDueDateDisplay }: TaskItemProps) {
  const dueDateDisplay = getDueDateDisplay(task.due_date);

  return (
    <div className="flex items-start gap-3 p-4 border border-slate-800 rounded-lg bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
      <button
        onClick={() => onToggleStatus(task.id, task.status)}
        className="mt-0.5 shrink-0"
      >
        {task.status === "completed" ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : task.status === "in_progress" ? (
          <Clock className="w-5 h-5 text-blue-400" />
        ) : (
          <Circle className="w-5 h-5 text-slate-500 hover:text-yellow-400 transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={`font-medium ${
              task.status === "completed" ? "text-slate-500 line-through" : "text-white"
            }`}
          >
            {task.title}
          </h3>
          <Badge variant="outline" className={STATUS_COLORS[task.status]}>
            {STATUS_LABELS[task.status]}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-slate-400 mb-2">{task.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {dueDateDisplay && (
            <span className={`flex items-center gap-1 ${dueDateDisplay.className}`}>
              <Calendar className="w-3 h-3" />
              {dueDateDisplay.text}
            </span>
          )}
                      <span>Created {formatDate(task.created_at)}</span>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-slate-400 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
