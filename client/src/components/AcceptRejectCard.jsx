import { CheckCircle2, XCircle } from 'lucide-react';

export const AcceptRejectCard = ({ decision = 'ACCEPT', confidence = 94, reasons = [], loadTitle = 'Corridor Load Match' }) => {
  const isAccept = decision === 'ACCEPT';

  return (
    <div className={`panel-refined p-4 border-l-4 ${isAccept ? 'border-l-emerald-600' : 'border-l-red-500'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-zinc-900">{loadTitle}</h4>
        <span className={`badge-subtle ${isAccept ? 'badge-green' : 'badge-red'}`}>
          {isAccept ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {decision} ({confidence}%)
        </span>
      </div>

      <div className="space-y-1 text-xs text-zinc-600">
        <div className="text-[11px] font-medium uppercase text-zinc-500 tracking-wider">Evaluation Factors:</div>
        <ul className="space-y-1 pt-0.5">
          {reasons.map((r, idx) => (
            <li key={idx} className="flex items-start gap-1.5 font-normal text-zinc-700">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isAccept ? 'bg-emerald-600' : 'bg-red-500'}`} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
