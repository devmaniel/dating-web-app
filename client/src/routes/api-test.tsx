import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import axios from 'axios';

export const Route = createFileRoute('/api-test')({
  component: ApiTestPage,
});

/**
 * API Test Page
 * Simple page to test API connectivity from Vercel to Render
 * Access at: /api-test
 */
function ApiTestPage() {
  const [pingResult, setPingResult] = useState<any>(null);
  const [healthResult, setHealthResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const testPing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/ping`);
      setPingResult(response.data);
    } catch (err: any) {
      setError(err.message);
      setPingResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/health`);
      setHealthResult(response.data);
    } catch (err: any) {
      setError(err.message);
      setHealthResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>

        {/* API URL Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">API URL:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">{API_URL}</code>
            </p>
            <p className="text-sm">
              <span className="font-medium">Environment:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded">
                {import.meta.env.MODE}
              </code>
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="flex gap-4">
            <button
              onClick={testPing}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test /ping'}
            </button>
            <button
              onClick={testHealth}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Testing...' : 'Test /health'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Ping Result */}
        {pingResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              ✅ Ping Result
            </h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(pingResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Health Result */}
        {healthResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              ✅ Health Check Result
            </h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(healthResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              Click <strong>"Test /ping"</strong> to verify basic API connectivity
            </li>
            <li>
              Click <strong>"Test /health"</strong> to check all services (DB, S3, etc.)
            </li>
            <li>If you see errors, check your VITE_API_URL environment variable</li>
            <li>Make sure there are no trailing slashes in the API URL</li>
            <li>Check browser console for CORS errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
