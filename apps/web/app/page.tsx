'use client'

import { apiClient } from "@/api";
import { Cadence } from "@email-cadence/shared";
import { useEffect, useState } from "react";

const payload = {
  "id": "cad_123",
  "name": "Welcome Flow",
  "steps": [
    {
      "id": "1",
      "type": "SEND_EMAIL",
      "subject": "Welcome",
      "body": "Hello there"
    },
    {
      "id": "2",
      "type": "WAIT",
      "seconds": 10
    },
    {
      "id": "3",
      "type": "SEND_EMAIL",
      "subject": "Follow up",
      "body": "Checking in"
    }
  ]
};

export default function Home() {
  const [json, setJson] = useState(JSON.stringify(payload, null, 2));
  const [enrollmentId, setEnrollmentId] = useState('');
  const [state, setState] = useState(null);
  const [autoPoll, setAutoPoll] = useState(false);

  async function enroll() {
    const cadence = JSON.parse(json) satisfies Cadence;

    await apiClient.post('/cadences', cadence);

    const res = await apiClient.post('/enrollments', {
      cadenceId: cadence.id,
      contactEmail: 'joshuaming.jm@gmail.com',
    });

    console.log(res.data.id);

    setEnrollmentId(res.data.id);
  }

  async function poll() {
    if (!enrollmentId) return;

    const res = await apiClient.get(`/enrollments/${enrollmentId}`);
    setState(res.data);
  }

  async function updateCadence() {
    if (!enrollmentId) return;

    const cadence = JSON.parse(json) satisfies Cadence;

    await apiClient.put(`enrollments/${enrollmentId}/cadence`, {
      steps: cadence.steps,
    });

    await poll();
  }

  useEffect(() => {
    if (!autoPoll) return;

    const id = setInterval(poll, 1000);
    return () => clearInterval(id);
  }, [autoPoll, enrollmentId]);

  return (
    <div className="p-10 space-y-4">
      <h1>Email Cadence</h1>
      <textarea
        rows={15}
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      
      <div className="flex justify-end gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="size-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            checked={autoPoll}
            onChange={() => setAutoPoll((prev) => !prev)}
          />
          <span className="text-sm text-gray-700">Auto Poll</span>
        </label>
        <button
          type="button"
          onClick={enroll}
          className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 active:scale-95 transition"
        >
          Enroll
        </button>
        <button
          type="button"
          onClick={updateCadence}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={poll}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 font-medium transition"
        >
          Poll
        </button>
      </div>

      <p><strong>Enrollment ID:</strong> {enrollmentId || '-'}</p>

      <h2>Workflow state</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
