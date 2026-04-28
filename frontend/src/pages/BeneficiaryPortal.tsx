import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import api from '../lib/api';

interface Balance {
  allocatedAmount: number;
  claimedAmount: number;
}

interface Condition {
  id: string;
  conditionType: string;
  isFulfilled: boolean;
  verifiedAt: string | null;
}

export default function BeneficiaryPortal() {
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState<Balance | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!publicKey.trim()) return;
    setLoading(true);
    setError('');
    try {
      const [balRes, histRes] = await Promise.all([
        api.get(`/beneficiary/${publicKey}/balance`),
        api.get(`/beneficiary/${publicKey}/history`),
      ]);
      setBalance(balRes.data);
      setConditions(histRes.data);
    } catch {
      setError('Beneficiary not found or network error.');
    } finally {
      setLoading(false);
    }
  };

  const connectFreighter = async () => {
    // TODO: import freighterApi and call getPublicKey()
    alert('Freighter integration coming soon');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Beneficiary Portal</h2>
        <button
          onClick={connectFreighter}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          <Wallet size={16} /> Connect Wallet
        </button>
      </div>

      {/* Lookup */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Enter your Stellar public key
        </label>
        <div className="flex gap-2">
          <input
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="G..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={lookup}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Look up'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Balance */}
      {balance && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Allocated</p>
            <p className="text-2xl font-bold text-primary mt-1">
              ${Number(balance.allocatedAmount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">USDC</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Claimed</p>
            <p className="text-2xl font-bold text-secondary mt-1">
              ${Number(balance.claimedAmount).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">USDC</p>
          </div>
        </div>
      )}

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Conditions</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {conditions.map((c) => (
              <li key={c.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.conditionType}</p>
                  {c.verifiedAt && (
                    <p className="text-xs text-gray-400">
                      Verified {new Date(c.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <StatusBadge status={c.isFulfilled ? 'fulfilled' : 'pending'} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TODO: Claim button — POST /api/beneficiary/:publicKey/claim */}
      {/* TODO: Off-ramp button — SEP-24 withdrawal flow */}
    </div>
  );
}
