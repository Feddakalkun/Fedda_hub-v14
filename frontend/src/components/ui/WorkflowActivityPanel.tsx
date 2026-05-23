import { useMemo } from 'react';
import { CheckCircle2, Clock3, AlertTriangle, Loader2 } from 'lucide-react';
import { useComfyExecution } from '../../contexts/ComfyExecutionContext';

function fmtTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour12: false });
}

export const WorkflowActivityPanel = () => {
  const { state, currentNodeName, progress, completedNodes, totalNodes, activityLog } = useComfyExecution();

  const headline = useMemo(() => {
    if (state === 'executing') return `${currentNodeName || 'Running'} (${progress}%)`;
    if (state === 'error') return 'Workflow failed';
    if (state === 'done') return 'Workflow complete';
    return 'Idle';
  }, [state, currentNodeName, progress]);

  const visible = activityLog.slice(0, 10);

  return (
    <section className="mb-4 rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-cyan-300" />
          <p className="text-xs uppercase tracking-widest text-cyan-200/90 font-semibold">Workflow Activity</p>
        </div>
        <p className="text-[11px] text-cyan-100/80 font-mono">
          {totalNodes > 0 ? `${completedNodes}/${totalNodes} nodes` : 'no active run'}
        </p>
      </div>

      <div className="text-xs text-cyan-100/90 mb-2">
        {state === 'executing' && <Loader2 className="inline w-3 h-3 mr-1 animate-spin" />}
        {headline}
      </div>

      <div className="max-h-40 overflow-auto space-y-1 pr-1 custom-scrollbar">
        {visible.length === 0 ? (
          <p className="text-[11px] text-cyan-100/55">No workflow events yet.</p>
        ) : (
          visible.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-[11px]">
              {item.level === 'error' ? (
                <AlertTriangle className="w-3 h-3 text-rose-300 flex-shrink-0" />
              ) : item.level === 'success' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-300 flex-shrink-0" />
              ) : (
                <Loader2 className="w-3 h-3 text-cyan-300/90 flex-shrink-0" />
              )}
              <span className="text-cyan-100/60 font-mono">{fmtTime(item.ts)}</span>
              <span className="text-cyan-100/90 truncate">
                {item.nodeName}: {item.message}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
