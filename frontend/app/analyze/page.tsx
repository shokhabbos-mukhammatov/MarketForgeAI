'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnalyticsCard from '../../components/AnalyticsCard';

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
  trends: string[];
  opportunities: string[];
  actionPlan: {
    title: string;
    description: string;
    priority: number;
    timeline: string;
    roi_estimate: string;
  }[];
  marketingStrategy: string;
  competitiveAnalysis: string;
  productivityTips: string[];
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

  
  const handleSubmit = async () => {
    try {
      // Add industry input field or infer from business name
      const industryCategory = task === 'market-analysis' ? 'business analysis' : 
                             name.toLowerCase().includes('bakery') ? 'bakery' :
                             name.toLowerCase().includes('restaurant') ? 'restaurant' :
                             name.toLowerCase().includes('tech') ? 'technology' :
                             'general business';
      
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          website, 
          categories: industryCategory,  // Send actual industry, not task type
          task: task  // Send task separately
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json();
      setJobId(json.jobId);
      setStatus({ status: 'queued', progress: 0 });
      setStep(3);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(`Analysis failed: ${error.message}`);
    }
  };
  
  /* ------------------------------------------------------------------
   * 2️⃣  Poll status/results every 3 s when jobId exists
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!jobId) return;
    const timer = setInterval(async () => {
      try {
        const st = await fetch(`http://localhost:5000/api/analyze/${jobId}/status`).then(r => r.json());
        setStatus(st);
        if (st.status === 'completed') {
          const rpt = await fetch(`http://localhost:5000/api/analyze/${jobId}/results`).then(r => r.json());
          setReport(rpt);
          clearInterval(timer);
        }
      } catch (error) {
        console.error('Polling error:', error);
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
                    value={report.trends?.length?.toString() || "0"}
                    icon="TrendingUp"
                    chartType="bar"
                    data={report.trends?.map((t, i) => i + 1) || [1, 2, 3]}
                  />
                  <AnalyticsCard
                    title="Opportunities"
                    value={report.opportunities?.length?.toString() || "0"}
                    icon="Users"
                    chartType="bar"
                    data={report.opportunities?.map((o, i) => i + 1) || [1, 2, 3]}
                  />
                  <AnalyticsCard
                    title="Action items"
                    value={report.actionPlan?.length?.toString() || "0"}
                    icon="ListChecks"
                    chartType="bar"
                    data={report.actionPlan?.map((a, i) => i + 1) || [1, 2, 3]}
                  />
                </div>

               
                {/* Enhanced Action Items */}
                <div className="space-y-6 mt-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">🎯 Top Action Items</h3>
                    <div className="space-y-3">
                      {report.actionPlan?.map((action, i) => (
                        <div key={i} className="glass rounded-lg p-4 border border-white/20">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-white">{action.title}</h4>
                            <span className="text-green-400 text-sm font-medium">
                              ROI: {action.roi_estimate}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{action.description}</p>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Priority: {action.priority}</span>
                            <span>Timeline: {action.timeline}</span>
                          </div>
                        </div>
                      )) || <p>No action items available</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">📈 Market Trends</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.trends?.map((trend, i) => (
                        <li key={i} className="text-gray-300">{trend}</li>
                      )) || <li>No trends available</li>}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">🚀 Marketing Strategy</h3>
                    <p className="text-gray-300 bg-white/5 rounded-lg p-4">
                      {report.marketingStrategy || "No marketing strategy available"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
