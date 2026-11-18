import { CheckCircle2, Building2 } from "lucide-react";
import { formatDate, shortCode } from "@/lib/utils";
import { PrintButton } from "@/components/student/print-button";

export interface GatePassData {
  id: string;
  studentName: string;
  rollNumber: string;
  hostelName: string;
  fromDate: Date;
  toDate: Date;
  destination: string;
  reason: string;
  decidedAt: Date | null;
  decidedByName: string | null;
}

/** The approved pass a student shows at the gate: no separate sign-off needed. */
export function GatePass({ leave, showPrintButton = true }: { leave: GatePassData; showPrintButton?: boolean }) {
  return (
    <div className="mx-auto max-w-md">
      {showPrintButton ? (
        <div className="no-print mb-4 flex justify-end">
          <PrintButton />
        </div>
      ) : null}

      <div className="rounded-2xl border-2 border-success-500/40 bg-green-50/60 p-6 print:rounded-none print:border print:border-black print:bg-transparent dark:bg-green-950/10">
        <div className="flex items-center justify-between border-b border-success-500/30 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Building2 className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Hostel Gate Pass</p>
              <p className="text-xs text-ink-muted">JC Bose YMCA, Faridabad</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success-600 px-3 py-1 text-xs font-bold text-white">
            <CheckCircle2 className="size-3.5" aria-hidden="true" /> Approved
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Student</dt>
            <dd className="font-semibold text-ink">{leave.studentName}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Roll number</dt>
            <dd className="font-mono font-semibold text-ink">{leave.rollNumber}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Hostel</dt>
            <dd className="font-medium text-ink">{leave.hostelName}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Destination</dt>
            <dd className="font-medium text-ink">{leave.destination}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Out from</dt>
            <dd className="font-medium text-ink">{formatDate(leave.fromDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Return by</dt>
            <dd className="font-medium text-ink">{formatDate(leave.toDate)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-ink-muted">
          <span className="text-xs text-ink-muted">Reason: </span>
          {leave.reason}
        </p>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-xs text-ink-muted print:bg-transparent print:px-0">
          <span>
            Approved by {leave.decidedByName ?? "the hostel warden"}
            {leave.decidedAt ? ` on ${formatDate(leave.decidedAt)}` : ""}
          </span>
          <span className="font-mono font-semibold text-ink">#{shortCode(leave.id)}</span>
        </div>

        <p className="mt-4 text-center text-xs text-ink-muted">
          Show this pass to the caretaker at the gate. No further signature is required.
        </p>
      </div>
    </div>
  );
}
