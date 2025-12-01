import React, { useEffect, useState } from 'react';
import { fetchCircles, joinCircle, leaveCircle } from '../api';

const CirclesList = () => {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadCircles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchCircles();
      const payload = res.data;
      const data = Array.isArray(payload) ? payload : (payload.results || payload || []);
      setCircles(data);
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Failed to load circles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCircles();
  }, []);

  const handleJoin = async (id) => {
    setBusyId(id);
    try {
      await joinCircle(id);
      await loadCircles();
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Failed to join');
    } finally {
      setBusyId(null);
    }
  };

  const handleLeave = async (id) => {
    setBusyId(id);
    try {
      await leaveCircle(id);
      await loadCircles();
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Failed to leave');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading circles…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Your Circles</h2>
        <p className="text-gray-500">Join or leave existing groups</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {circles.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">{c.name}</div>
                  {c.is_private && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">🔒 Private</span>
                  )}
                </div>
                {c.description && (
                  <div className="text-gray-600 text-sm mt-1">{c.description}</div>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-gray-400 text-xs">Members: {c.member_count ?? '-'}</div>
                  {c.user_role && (
                    <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      {c.user_role === 'creator' && '👑 Creator'}
                      {c.user_role === 'admin' && '⚡ Admin'}
                      {c.user_role === 'member' && '✓ Member'}
                      {c.user_role === 'pending' && '⏳ Pending'}
                    </div>
                  )}
                </div>
              </div>
              <div>
                {c.user_role === 'pending' ? (
                  <button
                    className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Pending Approval
                  </button>
                ) : c.is_member ? (
                  <button
                    className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                    disabled={busyId === c.id}
                    onClick={() => handleLeave(c.id)}
                  >
                    {busyId === c.id ? 'Leaving…' : 'Leave'}
                  </button>
                ) : (
                  <button
                    className="px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                    disabled={busyId === c.id}
                    onClick={() => handleJoin(c.id)}
                  >
                    {busyId === c.id ? 'Joining…' : (c.is_private ? 'Request Join' : 'Join')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CirclesList;
