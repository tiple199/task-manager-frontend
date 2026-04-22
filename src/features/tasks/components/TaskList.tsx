'use client';

import { useState } from 'react';
import { useTasks, useDeleteTask } from '../hooks';
import { TaskModal } from './TaskModal';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Plus, Search, Edit2, Trash2, AlertCircle,
  SlidersHorizontal, Calendar, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
type PageSize = typeof PAGE_SIZE_OPTIONS[number];

/** Tạo mảng số trang hiển thị (có dấu '...' nếu nhiều trang) */
function buildPageWindow(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}

export function TaskList() {
  const [params, setParams] = useState({
    page: 1, limit: 10 as PageSize,
    search: '', status: '', priority: '', sort: 'deadline',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data, isLoading, isError } = useTasks(params);
  const deleteMutation = useDeleteTask();

  const handleEdit    = (task: Task)                        => { setEditingTask(task); setIsModalOpen(true); };
  const handleAddNew  = ()                                   => { setEditingTask(null); setIsModalOpen(true); };
  const handleDelete  = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) deleteMutation.mutate(id.toString());
  };

  const priorityConfig: Record<string, { label: string; dot: string; badge: string }> = {
    high:   { label: 'High',   dot: 'bg-rose-500',  badge: 'bg-rose-50 text-rose-600 border-rose-200' },
    medium: { label: 'Medium', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    low:    { label: 'Low',    dot: 'bg-sky-500',   badge: 'bg-sky-50 text-sky-600 border-sky-200' },
  };

  const statusConfig: Record<string, { dot: string }> = {
    completed:   { dot: 'bg-emerald-500' },
    in_progress: { dot: 'bg-indigo-500' },
    pending:     { dot: 'bg-orange-400' },
  };

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return <span className="text-orange-500 font-semibold">Today</span>;
    if (isPast(date))  return <span className="text-red-500 font-semibold">{format(date, 'MMM d')} · Overdue</span>;
    return <span className="text-slate-500">{format(date, 'MMM d, yyyy')}</span>;
  };

  const totalPages   = data ? Math.ceil(data.count / params.limit) : 1;
  const pageWindow   = buildPageWindow(params.page, totalPages);
  const startRecord  = data && data.count > 0 ? (params.page - 1) * params.limit + 1 : 0;
  const endRecord    = data ? Math.min(params.page * params.limit, data.count) : 0;

  const selectCls = [
    'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400',
    'hover:border-slate-300 transition-colors cursor-pointer',
  ].join(' ');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            {data ? `${data.count} task${data.count !== 1 ? 's' : ''} total` : 'Loading…'}
          </p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* ─── Filters ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            <Input
              placeholder="Search tasks…"
              className="pl-10"
              value={params.search}
              onChange={(e) => setParams((p) => ({ ...p, search: e.target.value, page: 1 }))}
            />
          </div>

          <select className={selectCls} value={params.status}
            onChange={(e) => setParams((p) => ({ ...p, status: e.target.value, page: 1 }))}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select className={selectCls} value={params.priority}
            onChange={(e) => setParams((p) => ({ ...p, priority: e.target.value, page: 1 }))}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select className={selectCls} value={params.sort}
            onChange={(e) => setParams((p) => ({ ...p, sort: e.target.value, page: 1 }))}>
            <option value="deadline">Nearest Deadline</option>
            <option value="-deadline">Furthest Deadline</option>
            <option value="-priority">Priority (High → Low)</option>
            <option value="priority">Priority (Low → High)</option>
          </select>
        </div>
      </div>

      {/* ─── Task List ─── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: params.limit > 5 ? 5 : params.limit }).map((_, i) => (
            <div key={i} className="skeleton h-[68px] w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-16 bg-white rounded-2xl border border-rose-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <p className="font-semibold text-slate-700">Failed to load tasks</p>
          <p className="text-sm text-slate-400">Please try refreshing the page.</p>
        </div>
      ) : data?.tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center animate-float">
            <ClipboardList className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800">No tasks yet</h3>
            <p className="mt-1 text-sm text-slate-400">Create your first task to get started.</p>
          </div>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="w-4 h-4 mr-1.5" /> New Task
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {data?.tasks.map((task, index) => {
            const isCompleted = task.status?.toLowerCase() === 'completed';
            const p = priorityConfig[task.priority?.toLowerCase()];
            const s = statusConfig[task.status?.toLowerCase()];

            return (
              <div
                key={task.id}
                className={cn(
                  'group relative flex items-center gap-4 px-5 py-4 rounded-2xl',
                  'bg-white border transition-all duration-200 cursor-pointer animate-fade-in',
                  isCompleted
                    ? 'border-slate-100 opacity-60'
                    : 'border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:border-indigo-200 hover:shadow-[0_4px_16px_-4px_rgba(99,102,241,0.18)] hover:-translate-y-[1px]'
                )}
                style={{ animationDelay: `${index * 40}ms` }}
                onClick={() => handleEdit(task)}
              >
                <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', s?.dot ?? 'bg-slate-300')} />

                <div className="flex-1 min-w-0">
                  <p className={cn('text-[15px] font-semibold text-slate-800 truncate', isCompleted && 'line-through text-slate-400')}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5 hidden sm:block">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {p && (
                    <span className={cn(
                      'hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-wide',
                      p.badge
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', p.dot)} />
                      {p.label}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 text-xs min-w-[90px] justify-end">
                    <Calendar className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    {formatDeadline(task.deadline)}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-2 group-hover:translate-x-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      onClick={(e) => { e.stopPropagation(); handleEdit(task); }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      onClick={(e) => handleDelete(task.id, e)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Pagination bar ─── */}
      {data && data.count > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Left: info + rows/page */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>
                Showing{' '}
                <span className="font-semibold text-slate-700">{startRecord}</span>
                {' – '}
                <span className="font-semibold text-slate-700">{endRecord}</span>
                {' of '}
                <span className="font-semibold text-slate-700">{data.count}</span>
                {' results'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 hidden md:inline">Rows per page:</span>
                <div className="relative">
                  <select
                    value={params.limit}
                    onChange={(e) =>
                      setParams((p) => ({
                        ...p,
                        limit: Number(e.target.value) as PageSize,
                        page: 1,
                      }))
                    }
                    className={cn(
                      'h-8 rounded-lg border border-slate-200 bg-white pl-2.5 pr-7 text-sm text-slate-700 font-medium',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400',
                      'hover:border-slate-300 transition-colors cursor-pointer appearance-none'
                    )}
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  {/* custom chevron */}
                  <ChevronRight className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rotate-90 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Right: page buttons — always visible, disabled at boundaries */}
            <div className="flex items-center gap-1">
              {/* First page */}
              <button
                onClick={() => setParams((p) => ({ ...p, page: 1 }))}
                disabled={params.page === 1}
                className={cn(
                  'h-8 w-8 flex items-center justify-center rounded-lg transition-all border',
                  params.page === 1
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50 border-slate-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-transparent'
                )}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              {/* Previous page */}
              <button
                onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
                disabled={params.page === 1}
                className={cn(
                  'h-8 w-8 flex items-center justify-center rounded-lg transition-all border',
                  params.page === 1
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50 border-slate-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-transparent'
                )}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page number buttons */}
              <div className="flex items-center gap-1 mx-1">
                {totalPages > 1 ? (
                  pageWindow.map((item, idx) =>
                    item === '...' ? (
                      <span key={`dot-${idx}`} className="h-8 w-8 flex items-center justify-center text-slate-400 text-sm select-none">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setParams((p) => ({ ...p, page: item as number }))}
                        className={cn(
                          'h-8 w-8 rounded-lg text-sm font-semibold transition-all',
                          item === params.page
                            ? 'gradient-brand text-white shadow-[0_2px_8px_rgba(99,102,241,0.35)]'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                        )}
                      >
                        {item}
                      </button>
                    )
                  )
                ) : (
                  /* Trang duy nhất — hiện chỉ số trang cố định */
                  <span className="h-8 px-3 flex items-center justify-center rounded-lg text-sm font-semibold gradient-brand text-white shadow-[0_2px_8px_rgba(99,102,241,0.25)]">
                    1 / 1
                  </span>
                )}
              </div>

              {/* Next page */}
              <button
                onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
                disabled={params.page >= totalPages}
                className={cn(
                  'h-8 w-8 flex items-center justify-center rounded-lg transition-all border',
                  params.page >= totalPages
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50 border-slate-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-transparent'
                )}
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Last page */}
              <button
                onClick={() => setParams((p) => ({ ...p, page: totalPages }))}
                disabled={params.page >= totalPages}
                className={cn(
                  'h-8 w-8 flex items-center justify-center rounded-lg transition-all border',
                  params.page >= totalPages
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50 border-slate-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-transparent'
                )}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
}

function ClipboardList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" /><path d="M12 16h4" />
      <path d="M8 11h.01" /><path d="M8 16h.01" />
    </svg>
  );
}
