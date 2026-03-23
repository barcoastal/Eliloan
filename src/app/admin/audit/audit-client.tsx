"use client";

import { useState, useEffect } from "react";
import { getAuditLogs } from "@/actions/audit";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  details: string | null;
  createdAt: Date;
};

export default function AuditClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getAuditLogs({
        action: actionFilter || undefined,
      });
      setLogs(result.logs);
      setTotal(result.total);
      setLoading(false);
    }
    load();
  }, [actionFilter]);

  const actions = [
    "APPROVE", "REJECT", "FUND", "EDIT_INCOME",
    "VIEW_SSN", "CHANGE_SETTING", "LOGIN", "WAIVE_FEE",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <span className="text-sm text-gray-500">{total} entries</span>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActionFilter("")}
          className={`px-3 py-1 rounded-full text-sm ${
            !actionFilter ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All
        </button>
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => setActionFilter(action)}
            className={`px-3 py-1 rounded-full text-sm ${
              actionFilter === action ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {action}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {log.entityType} / {log.entityId.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.performedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {log.details || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
