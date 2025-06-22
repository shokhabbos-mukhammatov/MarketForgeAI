'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnalyticsCard from '@/components/AnalyticsCard';

/* -----------------------------  types  ----------------------------- */

type Step = 1 | 2 | 3;
type TaskType =
  | 'market-analysis'
  | 'trending-content'
  | 'blog-ideas'
  | 'content-plan';

interface JobStatus {
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress?: number;
}

interface Report {
  trends: any[];
  competitors: any[];
  actionPlan: any[];
}

/* ---------------------------  component  --------------------------- */

export default function MarketForgeWizard() {
  const [step, setStep] = useState<Step>(1);

  // step-1 fields
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');

  // step-2
  const [task, setTask] = useState<TaskType>('market-analysis');

  // job tracking
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  /* ------------------------------------------------------------------
   * 1️⃣  Create job  (POST /api/analyze)
   * ------------------------------------------------------------------ */
  const handleSubmit = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, website, categories: [task] })
    });
    const json = await res.json();
    setJobId(json.jobId);
    setStatus({ status: 'queued', progress: 0 });
    setStep(3); // jump to progress screen
  };

  /* ------------------------------------------------------------------
   * 2️⃣  Poll status/results every 3 s when jobId exists
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!jobId) return;
    const timer = setInterval(async () => {
      const st = await fetch(`/api/analyze/${jobId}/status`).then(r => r.json());
      setStatus(st);
      if (st.status === 'completed') {
        const rpt = await fetch(`/api/analyze/${jobId}/results`).then(r => r.json());
        setReport(rpt);
        clearInterval(timer);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [jobId]);

  /* ---------------------------  render  --------------------------- */
  return (
    <main className="mx-auto max-w-2xl p-6">
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1 — Your business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Business name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              placeholder="Website URL"
              value={website}
              onChange={e => setWebsite(e.target.value)}
            />
            <Button
              onClick={() => setStep(2)}
              disabled={!name || !website}
              className="w-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2 — Select a task</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={task}
              onValueChange={val => setTask(val as TaskType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
                <TabsTrigger value="trending-content">Trending Topics</TabsTrigger>
                <TabsTrigger value="blog-ideas">Blog Ideas</TabsTrigger>
                <TabsTrigger value="content-plan">30-day Plan</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleSubmit} className="mt-4 w-full">
              Generate report
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3 — Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!report && (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" />
                <p className="text-muted-foreground">
                  {status?.status === 'processing'
                    ? `Crunching data (${status?.progress ?? 0} %)…`
                    : 'Queued…'}
                </p>
              </div>
            )}

            {report && (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span>Completed</span>
                </div>

                {/* Quick KPI cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <AnalyticsCard
                    title="Trends found"
                    value={report.trends.length.toString()}
                    icon="TrendingUp"
                    chartType="bar"
                    data={report.trends.map(t => t.score)}
                  />
                  <AnalyticsCard
                    title="Competitors"
                    value={report.competitors.length.toString()}
                    icon="Users"
                    chartType="bar"
                    data={report.competitors.map(c => c.shareOfVoice * 100)}
                  />
                  <AnalyticsCard
                    title="Action items"
                    value={report.actionPlan.length.toString()}
                    icon="ListChecks"
                    chartType="bar"
                    data={report.actionPlan.map(a => 1)}
                  />
                </div>

                {/* Detailed list */}
                <h3 className="font-semibold mt-8">Top Action Items</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {report.actionPlan.map((a, i) => (
                    <li key={i}>
                      <b>{a.title}</b>
                      {a.description ? ` — ${a.description}` : ''}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
