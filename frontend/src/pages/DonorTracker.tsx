import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../lib/api';

interface Program {
  id: string;
  name: string;
  totalFunded: number;
  beneficiaries: { claimedAmount: number }[];
}

const COLORS = ['#0066FF', '#00C9A7', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DonorTracker() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ngo/programs').then((r) => setPrograms(r.data)).finally(() => setLoading(false));
  }, []);

  const pieData = programs.map((p) => ({
    name: p.name,
    value: Number(p.totalFunded),
  }));

  const totalFunded = programs.reduce((s, p) => s + Number(p.totalFunded), 0);
  const totalClaimed = programs.reduce(
    (s, p) => s + p.beneficiaries.reduce((bs, b) => bs + Number(b.claimedAmount), 0),
    0
  );

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Donor Transparency Portal</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Funded</p>
          <p className="text-2xl font-bold text-primary mt-1">${totalFunded.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Claimed</p>
          <p className="text-2xl font-bold text-secondary mt-1">${totalClaimed.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Utilization Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalFunded > 0 ? ((totalClaimed / totalFunded) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {pieData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Fund Allocation by Program</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Programs breakdown */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Program Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Program</th>
              <th className="px-5 py-3 text-left">Funded</th>
              <th className="px-5 py-3 text-left">Claimed</th>
              <th className="px-5 py-3 text-left">Utilization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.map((p) => {
              const claimed = p.beneficiaries.reduce((s, b) => s + Number(b.claimedAmount), 0);
              const funded = Number(p.totalFunded);
              const util = funded > 0 ? ((claimed / funded) * 100).toFixed(1) : '0.0';
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-5 py-3">${funded.toLocaleString()}</td>
                  <td className="px-5 py-3">${claimed.toLocaleString()}</td>
                  <td className="px-5 py-3">{util}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* TODO: Per-beneficiary drill-down with Stellar tx hash links */}
      {/* TODO: Export CSV / PDF audit report */}
    </div>
  );
}
