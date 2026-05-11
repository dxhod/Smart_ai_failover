import type { HistoryItem } from '@/lib/types';
import { ModelBadge } from './ModelBadge';

type Props = {
  items: HistoryItem[];
};

export function HistoryTable({ items }: Props) {
  return (
    <section className="border border-line bg-white">
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold">Last 5 requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-panel text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Prompt</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Debug</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-500" colSpan={5}>
                  No requests yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="max-w-md truncate px-4 py-3">{item.inputText}</td>
                  <td className="px-4 py-3"><ModelBadge model={item.usedModel} /></td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.forceError ? 'on' : 'off'}</td>
                  <td className="px-4 py-3">{item.executionTimeMs} ms</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
