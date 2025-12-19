import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';

type Props = { username: string };

const MAX_POINTS = 60; // show last 10 minutes (10s interval)

function MemoryPage({ username }: Props) {
  const [currentMb, setCurrentMb] = useState<string>('0.00');
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource('/resources/monitoring/memory');
    esRef.current = es;

    const onMemory = (e: MessageEvent) => {
      const mbStr = e.data;
      setCurrentMb(mbStr);
      const mb = parseFloat(mbStr);
      const ts = new Date();
      const label = ts.toLocaleTimeString();

      setLabels((prev) => {
        const next = [...prev, label];
        return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
      });
      setValues((prev) => {
        const next = [...prev, mb];
        return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
      });
    };

    es.addEventListener('memory', onMemory as EventListener);
    es.onerror = () => {
      // rely on server's reconnectDelay
    };

    return () => {
      es.removeEventListener('memory', onMemory as EventListener);
      es.close();
    };
  }, []);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Used Memory (MB)',
        data: values,
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.2,
        pointRadius: 2
      }
    ]
  }), [labels, values]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        title: { display: true, text: 'MB' },
        beginAtZero: true
      },
      x: {
        title: { display: true, text: 'Time' }
      }
    }
  }), []);

  return (
    <div className="p-3">
      <Card title="System Memory" subTitle={`Streaming for ${username}`} className="shadow-1">
        <div className="flex align-items-center gap-2 mb-3">
          <span className="text-700">Current:</span>
          <span className="text-900 font-bold">{currentMb} MB</span>
        </div>
        <Chart type="line" data={data} options={options} />
      </Card>
    </div>
  );
}

export default MemoryPage;
