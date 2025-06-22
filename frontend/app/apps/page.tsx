'use client';

import { useState, useRef, useEffect } from 'react';
import { clamp } from 'lodash'; 
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Play,
  ChevronRight,
  Activity,
  Cpu,
  Database,
  Cloud,
  Shield,
  BarChart3,
  Layers,
  GitBranch,
  Circle,
  X,
  FileText,
  Eye
} from 'lucide-react';

const LOCAL_BACKEND = 'http://127.0.0.1:5000';

interface FlowNode {
  id: string;
  type: 'trigger' | 'processing' | 'analysis' | 'output';
  status: 'idle' | 'active' | 'completed' | 'pulse' | 'error';
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  x: number;
  y: number;
  connections: string[];
  data?: any;
  progress?: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  fromNode: string;
  toNode: string;
}

interface BusinessFunction {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  inputs: {
    name: string;
    type: 'text' | 'textarea' | 'select';
    label: string;
    placeholder: string;
    required: boolean;
    options?: string[];
  }[];
}

export default function FlowBasedApp() {
  // pan & zoom state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [showInputForm, setShowInputForm] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([
    {
      id: 'trigger',
      type: 'trigger',
      status: 'idle',
      title: 'Data Input',
      subtitle: 'Market context & objectives',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      x: 100,
      y: 200,
      connections: ['validation', 'preprocessing'],
      progress: 0
    },
    {
      id: 'validation',
      type: 'processing',
      status: 'idle',
      title: 'Smart Validation',
      subtitle: 'AI-powered data verification',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      x: 350,
      y: 100,
      connections: ['ai-engine'],
      progress: 0
    },
    {
      id: 'preprocessing',
      type: 'processing',
      status: 'idle',
      title: 'Data Enrichment',
      subtitle: 'Market signals & trends',
      icon: Cpu,
      color: 'from-orange-500 to-red-500',
      x: 350,
      y: 300,
      connections: ['ai-engine'],
      progress: 0
    },
    {
      id: 'ai-engine',
      type: 'analysis',
      status: 'idle',
      title: 'AI Analysis',
      subtitle: 'Multi-model intelligence',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      x: 600,
      y: 200,
      connections: ['insights', 'predictions'],
      progress: 0
    },
    {
      id: 'insights',
      type: 'output',
      status: 'idle',
      title: 'Market Insights',
      subtitle: 'Actionable strategies',
      icon: Sparkles,
      color: 'from-yellow-500 to-amber-500',
      x: 850,
      y: 100,
      connections: [],
      progress: 0
    },
    {
      id: 'predictions',
      type: 'output',
      status: 'idle',
      title: 'Growth Forecasts',
      subtitle: 'Revenue projections',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      x: 850,
      y: 300,
      connections: [],
      progress: 0
    }
  ]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  // pan & zoom handlers
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => clamp(prev - e.deltaY * 0.001, 0.5, 3));
  };
  const onMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    panStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setTranslate({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const onMouseUp = () => setIsPanning(false);

  // Quick insights function for the flow
  const businessFunction: BusinessFunction = {
    id: 'quick-insights',
    name: 'Marketing Intelligence Analysis',
    description: 'Get comprehensive market insights powered by AI',
    endpoint: '/api/quick-insights',
    inputs: [
      {
        name: 'business_info',
        type: 'textarea',
        label: 'Business Context',
        placeholder: 'e.g., SaaS platform for project management, 50 employees, $10M ARR, B2B focus',
        required: true
      },
      {
        name: 'question', 
        type: 'textarea',
        label: 'Strategic Question',
        placeholder: 'e.g., How can we expand into enterprise market and increase ARR by 200%?',
        required: true
      }
    ]
  };

  // Particle animation system
  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      setParticles(prev => {
        return prev
          .map(particle => ({
            ...particle,
            progress: Math.min(particle.progress + 0.02, 1)
          }))
          .filter(particle => particle.progress < 1);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  // Progress animation for nodes
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowNodes(prev => prev.map(node => {
        if (node.status === 'active' && node.progress !== undefined) {
          return { ...node, progress: Math.min((node.progress || 0) + 5, 100) };
        }
        return node;
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (inputName: string, value: string) => {
    setCurrentInputs(prev => ({
      ...prev,
      [inputName]: value
    }));
  };

  const handleNodeClick = (nodeId: string) => {
    if (nodeId === 'trigger' && !isRunning) {
      setShowInputForm(true);
      setSelectedNode(nodeId);
    } else if (nodeId === 'ai-engine' && flowNodes.find(n => n.id === 'ai-engine')?.status === 'completed' && analysisResult) {
      setShowReport(true);
    } else {
      setSelectedNode(nodeId);
    }
  };

  const startAnalysis = async () => {
    // Validate inputs
    const missingInputs = businessFunction.inputs
      .filter(input => input.required && !currentInputs[input.name]?.trim())
      .map(input => input.label);

    if (missingInputs.length > 0) {
      alert(`Please fill in: ${missingInputs.join(', ')}`);
      return;
    }

    setShowInputForm(false);
    setIsRunning(true);
    setSelectedNode(null);
    
    // Reset all nodes
    setFlowNodes(prev => prev.map(node => ({ ...node, status: 'idle', progress: 0 })));
    
    // Execute flow with progress tracking
    const flowSequence = [
      { nodeId: 'trigger', delay: 0, duration: 1000 },
      { nodeId: 'validation', delay: 1000, duration: 1500 },
      { nodeId: 'preprocessing', delay: 1200, duration: 1500 },
      { nodeId: 'ai-engine', delay: 2500, duration: 2000 },
      { nodeId: 'insights', delay: 4000, duration: 500 },
      { nodeId: 'predictions', delay: 4200, duration: 500 }
    ];

    // Start API call
    const apiPromise = fetch(`${LOCAL_BACKEND}${businessFunction.endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentInputs)
    });

    for (const step of flowSequence) {
      setTimeout(() => {
        setFlowNodes(prev => prev.map(node => ({
          ...node,
          status: node.id === step.nodeId ? 'active' : 
                  flowSequence.findIndex(s => s.nodeId === node.id) < flowSequence.findIndex(s => s.nodeId === step.nodeId) ? 'completed' : 
                  node.status,
          progress: node.id === step.nodeId ? 0 : node.progress
        })));

        // Create particles for connections
        const currentNode = flowNodes.find(n => n.id === step.nodeId);
        if (currentNode?.connections.length) {
          currentNode.connections.forEach((targetId, index) => {
            const targetNode = flowNodes.find(n => n.id === targetId);
            if (targetNode) {
              setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                  setTimeout(() => {
                    setParticles(prev => [...prev, {
                      id: `${step.nodeId}-${targetId}-${Date.now()}-${i}`,
                      x: currentNode.x + 120,
                      y: currentNode.y + 40,
                      targetX: targetNode.x,
                      targetY: targetNode.y + 40,
                      progress: 0,
                      fromNode: step.nodeId,
                      toNode: targetId
                    }]);
                  }, i * 200);
                }
              }, index * 300);
            }
          });
        }

        // Mark as completed after duration
        setTimeout(() => {
          setFlowNodes(prev => prev.map(node => ({
            ...node,
            status: node.id === step.nodeId ? 'completed' : node.status,
            progress: node.id === step.nodeId ? 100 : node.progress
          })));
        }, step.duration);
      }, step.delay);
    }

    try {
      const response = await apiPromise;
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setAnalysisResult(data);

      // Complete animation with results
      setTimeout(() => {
        setFlowNodes(prev => prev.map(node => ({
          ...node,
          status: node.type === 'output' ? 'pulse' : 'completed',
          data: node.id === 'ai-engine' ? data : node.data
        })));
        setIsRunning(false);
      }, 5000);
    } catch (error) {
      console.error('Analysis error:', error);
      setTimeout(() => {
        setFlowNodes(prev => prev.map(node => ({
          ...node,
          status: node.id === 'ai-engine' ? 'error' : node.status
        })));
        setIsRunning(false);
      }, 3000);
    }
  };

  // Connection path calculator
  const getConnectionPath = (from: FlowNode, to: FlowNode) => {
    const startX = from.x + 120;
    const startY = from.y + 40;
    const endX = to.x;
    const endY = to.y + 40;
    
    const midX = (startX + endX) / 2;
    
    return `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} T ${endX} ${endY}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20" />
        
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MarketForge AI</h1>
                <p className="text-gray-400 text-sm">Marketing Intelligence Pipeline</p>
              </div>
            </div>
            
            {/* Control buttons */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/10">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                  <span className="text-white text-sm">System Active</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setCurrentInputs({});
                  setAnalysisResult(null);
                  setFlowNodes(prev => prev.map(node => ({ ...node, status: 'idle', progress: 0, data: undefined })));
                }}
                className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/10 text-white text-sm transition-all"
              >
                Reset Pipeline
              </button>
            </div>
          </div>
        </div>

        {/* Flow visualization with pan & zoom */}
        <div
          className="flex-1 relative overflow-auto"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          <div
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: '0 0',
              width: '2000px',
              height: '2000px',
            }}
          >
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            <defs>
              {/* Gradient definitions for connections */}
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(34, 211, 238, 0.3)" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Render connections */}
            {flowNodes.map(node => 
              node.connections.map(targetId => {
                const targetNode = flowNodes.find(n => n.id === targetId);
                if (!targetNode) return null;
                
                const isActive = node.status === 'active' || node.status === 'completed';
                
                return (
                  <g key={`${node.id}-${targetId}`}>
                    {/* Connection background */}
                    <path
                      d={getConnectionPath(node, targetNode)}
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2"
                    />
                    
                    {/* Animated connection */}
                    {isActive && (
                      <path
                        d={getConnectionPath(node, targetNode)}
                        fill="none"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        filter="url(#glow)"
                        strokeDasharray="8 4"
                        className="animate-pulse"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="12"
                          to="0"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    )}
                  </g>
                );
              })
            )}

            {/* Render particles */}
            {particles.map(particle => {
              const x = particle.x + (particle.targetX - particle.x) * particle.progress;
              const y = particle.y + (particle.targetY - particle.y) * particle.progress;
              
              return (
                <circle
                  key={particle.id}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="rgba(147, 51, 234, 0.8)"
                  filter="url(#glow)"
                  className="animate-pulse"
                >
                  <animate
                    attributeName="r"
                    values="4;6;4"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}
          </svg>

          {/* Render nodes */}
          {flowNodes.map(node => {
            const Icon = node.icon;
            const isActive = node.status === 'active';
            const isCompleted = node.status === 'completed';
            const isPulse = node.status === 'pulse';
            const isError = node.status === 'error';
            const canInteract = (node.id === 'trigger' && !isRunning) || 
                               (node.id === 'ai-engine' && isCompleted && analysisResult);
            
            return (
              <div
                key={node.id}
                className={`
                  absolute transition-all duration-500
                  ${canInteract ? 'cursor-pointer' : 'cursor-default'}
                  ${isActive || isPulse ? 'scale-110 z-20' : canInteract ? 'hover:scale-105 z-10' : 'z-10'}
                `}
                style={{ 
                  left: `${node.x}px`, 
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                {/* Node glow effect */}
                {(isActive || isPulse) && (
                  <div className={`
                    absolute inset-0 rounded-2xl blur-2xl
                    ${isPulse ? 'animate-pulse' : 'animate-ping'}
                  `}>
                    <div className={`w-full h-full bg-gradient-to-r ${node.color} opacity-50`} />
                  </div>
                )}
                
                {/* Node container */}
                <div className={`
                  relative group
                  bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4
                  border-2 transition-all duration-300
                  ${isActive ? 'border-purple-400 shadow-2xl shadow-purple-500/50' : ''}
                  ${isCompleted ? 'border-green-400/50' : ''}
                  ${isPulse ? 'border-yellow-400 shadow-2xl shadow-yellow-500/50' : ''}
                  ${isError ? 'border-red-400/50' : ''}
                  ${!isActive && !isCompleted && !isPulse && !isError ? 'border-white/10 hover:border-white/30' : ''}
                  min-w-[180px]
                `}>
                  {/* Status indicator */}
                  <div className="absolute -top-2 -right-2">
                    {isActive && (
                      <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                    )}
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                    {isPulse && (
                      <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                    {isError && (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  
                  {/* Node content */}
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg bg-gradient-to-r ${node.color}
                      ${isActive || isPulse ? 'animate-pulse' : ''}
                    `}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{node.title}</h3>
                      <p className="text-gray-400 text-xs">{node.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Progress bar for active nodes */}
                  {isActive && node.progress !== undefined && (
                    <div className="mt-3">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500" 
                             style={{ width: `${node.progress}%` }}>
                          <div className="h-full bg-white/30 animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive hints */}
                  {canInteract && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="text-xs text-gray-400 animate-pulse">
                        {node.id === 'trigger' ? 'Click to input data' : 'Click to view report'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Input Form Modal */}
        {showInputForm && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white">Marketing Intelligence Input</h3>
                <button
                  onClick={() => setShowInputForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {businessFunction.inputs.map((input) => (
                  <div key={input.name}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {input.label} {input.required && <span className="text-red-400">*</span>}
                    </label>
                    <textarea
                      value={currentInputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 resize-none transition-all"
                      rows={3}
                    />
                  </div>
                ))}
                
                <button
                  onClick={startAnalysis}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg px-4 py-3 text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Start Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Report Modal */}
        {showReport && analysisResult && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Marketing Intelligence Report</h3>
                </div>
                <button
                  onClick={() => setShowReport(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                    Executive Summary
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {analysisResult.insights || 'Comprehensive analysis of your marketing strategy and growth opportunities.'}
                  </p>
                </div>

                {/* Key Trends */}
                {analysisResult.trends && (
                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Market Trends & Opportunities
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.trends.slice(0, 5).map((trend: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-300 text-sm">{trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Plan */}
                {analysisResult.actionPlan && (
                  <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                    <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                      Strategic Action Plan
                    </h4>
                    <div className="space-y-3">
                      {analysisResult.actionPlan.slice(0, 5).map((action: any, index: number) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3">
                          <p className="text-white font-medium text-sm mb-1">
                            {typeof action === 'string' ? action : action.title}
                          </p>
                          {action.description && (
                            <p className="text-gray-400 text-xs">{action.description}</p>
                          )}
                          {action.timeline && (
                            <div className="flex items-center space-x-1 mt-2">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-500">{action.timeline}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-5 border border-purple-400/20">
                  <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-400" />
                    Expected Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Revenue Growth</p>
                      <p className="text-2xl font-bold text-purple-400">+45%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Market Share</p>
                      <p className="text-2xl font-bold text-blue-400">+12%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">ROI Timeline</p>
                      <p className="text-2xl font-bold text-green-400">6mo</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Confidence</p>
                      <p className="text-2xl font-bold text-yellow-400">87%</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-300 text-sm">Ready to implement these strategies?</p>
                  <button
                    onClick={() => {
                      setShowReport(false);
                      setCurrentInputs({});
                      setAnalysisResult(null);
                      setFlowNodes(prev => prev.map(node => ({ ...node, status: 'idle', progress: 0, data: undefined })));
                    }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-200"
                  >
                    Start New Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}