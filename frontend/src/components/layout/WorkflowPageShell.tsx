import type { ReactNode } from 'react';

type WorkflowPageShellProps = {
  left: ReactNode;
  right: ReactNode;
};

type WorkflowSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

type WorkflowFieldGridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
};

type WorkflowActionBarProps = {
  children: ReactNode;
  className?: string;
};

type WorkflowStatusTone = 'info' | 'success' | 'warning' | 'error';

type WorkflowStatusBannerProps = {
  message: string;
  tone?: WorkflowStatusTone;
};

type WorkflowPreviewPanelProps = {
  children: ReactNode;
};

export const WorkflowPageShell = ({ left, right }: WorkflowPageShellProps) => {
  return (
    <div className="flex h-full bg-[#080808] overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col border-r border-white/5 overflow-y-auto custom-scrollbar">
        <div className="px-5 py-5 space-y-5">{left}</div>
      </div>
      {right}
    </div>
  );
};

export const WorkflowSection = ({ title, children, className = '' }: WorkflowSectionProps) => {
  return (
    <section className={`space-y-3 ${className}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
      {children}
    </section>
  );
};

export const WorkflowFieldGrid = ({ children, cols = 2, className = '' }: WorkflowFieldGridProps) => {
  const colClass = cols === 1 ? 'grid-cols-1' : cols === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return <div className={`grid ${colClass} gap-2 ${className}`}>{children}</div>;
};

export const WorkflowActionBar = ({ children, className = '' }: WorkflowActionBarProps) => {
  return <div className={`pt-2 pb-6 space-y-3 ${className}`}>{children}</div>;
};

export const WorkflowStatusBanner = ({ message, tone = 'info' }: WorkflowStatusBannerProps) => {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      : tone === 'warning'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
      : tone === 'error'
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
      : 'border-violet-500/30 bg-violet-500/10 text-violet-200';
  return (
    <div className={`rounded-xl border px-3 py-2 text-[11px] ${toneClass}`}>
      {message}
    </div>
  );
};

export const WorkflowPreviewPanel = ({ children }: WorkflowPreviewPanelProps) => {
  return <div className="w-[40%] min-w-[360px] max-w-[720px]">{children}</div>;
};

