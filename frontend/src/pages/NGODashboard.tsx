import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';

interface Program {
  id: string;
  name: string;
  totalFunded: number;
  beneficiaries: { id: string }[];
}

interface Beneficiary {
  id: string;
  name: string;
  publicKey: string;
  allocatedAmount: number;
  claimedAmount: number;
  conditions: { isFulfilled: boolean }[];
}

export default function NGODashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/ngo/programs'),
      api.get('/ngo/beneficiaries'),
    ]).then(([p, b]) => {
      setPrograms(p.data);
      setBeneficiaries(b.data);
    }).finally(() => setLoading(false));
  }, []);

  const totalFunded = programs.reduce((s, p) => s + Number(p.totalFunded), 0);
  const totalBeneficiaries = beneficiaries.length;
  const conditionsMet = beneficiaries.filter(
    (b) => b.conditions?.some((c) => c.isFulfilled)
  ).length;

  const chartData = programs.map((p) => ({
    name: p.name.slice(0, 12),
    funded: Number(p.totalFunded),
    beneficiaries: p.beneficiaries.length,
  }));

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">NGO Dashboard</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} /> New Program
          {/* TODO: Open create program modal */}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Funded" value={`$${totalFunded.toLocaleString()}`} sub="USDC" color="text-primary" />
        <StatCard label="Beneficiaries" value={totalBeneficiaries} />
        <StatCard label="Conditions Met" value={conditionsMet} color="text-secondary" />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Programs Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="funded" fill="#0066FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Programs table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Programs</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Beneficiaries</th>
              <th className="px-5 py-3 text-left">Funded (USDC)</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-5 py-3 text-gray-600">{p.beneficiaries.length}</td>
                <td className="px-5 py-3 text-gray-600">{Number(p.totalFunded).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <button className="text-primary text-xs hover:underline">
                    Fund Escrow {/* TODO: trigger fund escrow flow */}
                  </button>
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                  No programs yet. Create your first program.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Beneficiaries table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Beneficiaries</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Stellar Key</th>
              <th className="px-5 py-3 text-left">Allocated</th>
              <th className="px-5 py-3 text-left">Claimed</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {beneficiaries.map((b) => {
              const fulfilled = b.conditions?.some((c) => c.isFulfilled);
              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{b.name}</td>
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">
                    {b.publicKey.slice(0, 8)}…{b.publicKey.slice(-4)}
                  </td>
                  <td className="px-5 py-3">${Number(b.allocatedAmount).toLocaleString()}</td>
                  <td className="px-5 py-3">${Number(b.claimedAmount).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={fulfilled ? 'fulfilled' : 'pending'} />
                  </td>
                </tr>
              );
            })}
            {beneficiaries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                  No beneficiaries enrolled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// TODO: wrap in React ErrorBoundary
// TODO: add skeleton loading states instead of plain "Loading..." text
