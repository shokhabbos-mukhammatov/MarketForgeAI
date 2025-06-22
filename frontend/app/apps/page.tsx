'use client';

// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, ChevronLeft, ChevronRight, Database, Code, Workflow, Settings, CheckCircle, X, Minus, Plus } from 'lucide-react';
// import ReactMarkdown from 'react-markdown'
// import remarkGfm      from 'remark-gfm'

// interface Message {
//   id: number;
//   text: string;
//   sender: 'user' | 'ai';
//   timestamp: Date;
// }

// interface TreeNode {
//   id: string;
//   label: string;
//   description: string;
//   details: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   icon: any;
//   color: string;
//   children?: TreeNode[];
// }

// export default function AppsPage() {
//   const [chatVisible, setChatVisible] = useState(false); // Start closed
//   const [panelWidth, setPanelWidth] = useState(25); // 25% default
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "Hello! I'm here to help you with your workflow design. What would you like to create?",
//       sender: 'ai',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [selectedNode, setSelectedNode] = useState<string | null>(null);
//   const [focusedNode, setFocusedNode] = useState<string | null>(null);
//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [isResizing, setIsResizing] = useState(false);
//   const [savedFocusState, setSavedFocusState] = useState<{
//     panOffset: { x: number; y: number };
//     zoom: number;
//     selectedNode: string | null;
//     focusedNode: string | null;
//   } | null>(null);
//   const canvasRef = useRef<HTMLDivElement>(null);
//   const resizeRef = useRef<HTMLDivElement>(null);

//   const treeData: TreeNode = {
//     id: 'main',
//     label: 'Main Process',
//     description: 'Core workflow orchestration',
//     details: 'This is the central hub of your workflow system. It coordinates all other processes and manages the overall execution flow. Configure triggers, set up monitoring, and define success criteria here.',
//     x: 900,
//     y: 250,
//     width: 200,
//     height: 120,
//     icon: Workflow,
//     color: 'from-purple-500 to-blue-500',
//     children: [
//       {
//         id: 'data',
//         label: 'Data Processing',
//         description: 'Input validation & transformation',
//         details: 'Handles all incoming data streams, validates formats, transforms data structures, and ensures data quality before processing. Supports multiple input formats and real-time streaming.',
//         x: 650,
//         y: 150,
//         width: 160,
//         height: 100,
//         icon: Database,
//         color: 'from-green-500 to-teal-500'
//       },
//       {
//         id: 'logic',
//         label: 'Business Logic',
//         description: 'Core processing engine',
//         details: 'Contains the main business rules and processing algorithms. This module handles complex decision-making, rule evaluation, and core computational tasks.',
//         x: 650,
//         y: 280,
//         width: 160,
//         height: 100,
//         icon: Code,
//         color: 'from-orange-500 to-red-500',
//         children: [
//           {
//             id: 'validation',
//             label: 'Validation',
//             description: 'Data integrity checks',
//             details: 'Performs comprehensive validation of all data inputs and intermediate results. Includes schema validation, business rule checks, and data quality assessments.',
//             x: 450,
//             y: 230,
//             width: 140,
//             height: 80,
//             icon: CheckCircle,
//             color: 'from-blue-500 to-indigo-500'
//           },
//           {
//             id: 'processing',
//             label: 'Processing',
//             description: 'Algorithm execution',
//             details: 'Executes the core algorithms and computational processes. Handles parallel processing, optimization routines, and complex calculations with high performance.',
//             x: 450,
//             y: 330,
//             width: 140,
//             height: 80,
//             icon: Settings,
//             color: 'from-pink-500 to-rose-500'
//           }
//         ]
//       },
//       {
//         id: 'output',
//         label: 'Output Handler',
//         description: 'Result formatting & delivery',
//         details: 'Manages all output operations including result formatting, delivery to various endpoints, notification systems, and integration with external services.',
//         x: 650,
//         y: 410,
//         width: 160,
//         height: 100,
//         icon: Send,
//         color: 'from-cyan-500 to-blue-500'
//       }
//     ]
//   };

//   const maxPanDistance = 500;
//   const minZoom = 0.5;
//   const maxZoom = 2;

//   const handleSend = () => {
//     if (!inputText.trim()) return;

//     const newMessage: Message = {
//       id: messages.length + 1,
//       text: inputText,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages([...messages, newMessage]);
//     setInputText('');

//     setTimeout(() => {
//       const aiResponse: Message = {
//         id: messages.length + 2,
//         text: "I can help you design and optimize your workflow. Would you like me to explain any of the nodes in your diagram or suggest improvements?",
//         sender: 'ai',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, aiResponse]);
//     }, 1000);
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-area')) {
//       setIsDragging(true);
//       setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (isDragging) {
//       const newX = Math.max(-maxPanDistance, Math.min(maxPanDistance, e.clientX - dragStart.x));
//       const newY = Math.max(-maxPanDistance, Math.min(maxPanDistance, e.clientY - dragStart.y));
//       setPanOffset({ x: newX, y: newY });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleWheel = (e: React.WheelEvent) => {
//     e.preventDefault();
//     const delta = e.deltaY > 0 ? -0.1 : 0.1;
//     const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
//     setZoom(newZoom);
//   };

//   const handleNodeClick = (nodeId: string) => {
//     setSelectedNode(nodeId);
//     setFocusedNode(nodeId);
    
//     // Find the node and animate to focus on it
//     const findNode = (node: TreeNode): TreeNode | null => {
//       if (node.id === nodeId) return node;
//       if (node.children) {
//         for (const child of node.children) {
//           const found = findNode(child);
//           if (found) return found;
//         }
//       }
//       return null;
//     };
    
//     const targetNode = findNode(treeData);
//     if (targetNode) {
//       // Calculate center position accounting for right panel
//       const rightPanelWidth = 400; // Width of the right info panel
//       const availableWidth = window.innerWidth - (chatVisible ? window.innerWidth * panelWidth / 100 : 0) - rightPanelWidth;
//       const centerX = -targetNode.x - targetNode.width / 2 + (chatVisible ? window.innerWidth * panelWidth / 100 : 0) + availableWidth / 2;
//       const centerY = -targetNode.y - targetNode.height / 2 + window.innerHeight / 2;
      
//       setTimeout(() => {
//         setPanOffset({ 
//           x: Math.max(-maxPanDistance, Math.min(maxPanDistance, centerX)), 
//           y: Math.max(-maxPanDistance, Math.min(maxPanDistance, centerY))
//         });
//         setZoom(1.2);
//       }, 50);
//     }
//   };

//   const handleCloseInfo = () => {
//     setSelectedNode(null);
//     setFocusedNode(null);
//     // Smooth animation back to original position
//     setTimeout(() => {
//       setZoom(1);
//       setPanOffset({ x: 0, y: 0 });
//     }, 50);
//   };

//   const handleBackgroundClick = (e: React.MouseEvent) => {
//     if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-area')) {
//       if (focusedNode) {
//         handleCloseInfo();
//       }
//     }
//   };

//   // Handle chat visibility with focus state preservation
//   const handleChatToggle = (visible: boolean) => {
//     if (visible && (selectedNode || focusedNode)) {
//       // Save current focus state before opening chat
//       setSavedFocusState({
//         panOffset: { ...panOffset },
//         zoom,
//         selectedNode,
//         focusedNode
//       });
//     } else if (!visible && savedFocusState) {
//       // Restore focus state when closing chat
//       setTimeout(() => {
//         setPanOffset(savedFocusState.panOffset);
//         setZoom(savedFocusState.zoom);
//         setSelectedNode(savedFocusState.selectedNode);
//         setFocusedNode(savedFocusState.focusedNode);
//         setSavedFocusState(null);
//       }, 100);
//     }
//     setChatVisible(visible);
//   };

//   // Panel resizing logic with navigation bar constraint
//   const handleResizeStart = (e: React.MouseEvent) => {
//     if (chatVisible) {
//       setIsResizing(true);
//       e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     const handleResizeMove = (e: MouseEvent) => {
//       if (isResizing && chatVisible) {
//         const navBarHeight = 80; // Navigation bar height
//         const maxAllowedWidth = Math.min(45, ((window.innerHeight - navBarHeight) / window.innerHeight) * 45);
//         const newWidth = Math.min(maxAllowedWidth, Math.max(20, (e.clientX / window.innerWidth) * 100));
//         setPanelWidth(newWidth);
//       }
//     };

//     const handleResizeEnd = () => {
//       setIsResizing(false);
//     };

//     if (isResizing) {
//       document.addEventListener('mousemove', handleResizeMove);
//       document.addEventListener('mouseup', handleResizeEnd);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleResizeMove);
//       document.removeEventListener('mouseup', handleResizeEnd);
//     };
//   }, [isResizing, chatVisible]);

//   const getConnectionPath = (from: TreeNode, to: TreeNode) => {
//     const fromCenterX = from.x + from.width / 2;
//     const fromCenterY = from.y + from.height / 2;
//     const toCenterX = to.x + to.width / 2;
//     const toCenterY = to.y + to.height / 2;
    
//     // Determine connection points based on relative positions
//     let fromX, fromY, toX, toY;
    
//     if (fromCenterX > toCenterX) {
//       // Parent is to the right of child
//       fromX = from.x;
//       fromY = fromCenterY;
//       toX = to.x + to.width;
//       toY = toCenterY;
//     } else {
//       // Parent is to the left of child
//       fromX = from.x + from.width;
//       fromY = fromCenterY;
//       toX = to.x;
//       toY = toCenterY;
//     }
    
//     const midX = (fromX + toX) / 2;
    
//     return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
//   };

//   const renderNode = (node: TreeNode, parentNode?: TreeNode) => {
//     const Icon = node.icon;
//     const isSelected = selectedNode === node.id;
//     const isFocused = focusedNode === node.id;
    
//     return (
//       <g key={node.id}>
//         {/* Connection line to parent */}
//         {parentNode && (
//           <path
//             d={getConnectionPath(parentNode, node)}
//             stroke="rgba(255, 255, 255, 0.4)"
//             strokeWidth="2"
//             fill="none"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         )}
        
//         {/* Node */}
//         <g
//           className="cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleNodeClick(node.id);
//           }}
//         >
//           <rect
//             x={node.x}
//             y={node.y}
//             width={node.width}
//             height={node.height}
//             rx="12"
//             ry="12"
//             fill="rgba(255, 255, 255, 0.12)"
//             stroke={isFocused ? 'rgba(255, 255, 255, 0.8)' : isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)'}
//             strokeWidth={isFocused ? '3' : isSelected ? '2' : '1'}
//           />
          
//           {/* Node content */}
//           <foreignObject 
//             x={node.x + 16} 
//             y={node.y + 16} 
//             width={node.width - 32} 
//             height={node.height - 32}
//           >
//             <div className="flex flex-col h-full select-none">
//               <div className="flex items-center space-x-2 mb-2">
//                 <div className={`p-1.5 rounded-lg bg-gradient-to-r ${node.color} bg-opacity-20`}>
//                   <Icon size={16} className="text-white" />
//                 </div>
//                 <h3 className="text-white text-sm font-medium truncate">{node.label}</h3>
//               </div>
//               <p className="text-gray-300 text-xs leading-tight flex-1">{node.description}</p>
//               {node.id === 'main' && (
//                 <div className="flex space-x-1 mt-2">
//                   <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
//                     Configure
//                   </button>
//                   <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
//                     Run
//                   </button>
//                 </div>
//               )}
//             </div>
//           </foreignObject>
//         </g>
        
//         {/* Render children */}
//         {node.children?.map(child => renderNode(child, node))}
//       </g>
//     );
//   };

//   const getSelectedNodeData = () => {
//     const findNode = (node: TreeNode): TreeNode | null => {
//       if (node.id === selectedNode) return node;
//       if (node.children) {
//         for (const child of node.children) {
//           const found = findNode(child);
//           if (found) return found;
//         }
//       }
//       return null;
//     };
//     return findNode(treeData);
//   };

//   const selectedNodeData = getSelectedNodeData();

//   return (
//     <div className="h-screen flex overflow-hidden">
//       {/* AI Chat Panel */}
//       {chatVisible && (
//         <div 
//           className="flex-shrink-0 transition-all duration-300 z-30 h-screen"
//           style={{ 
//             width: `${panelWidth}%`
//           }}
//         >
//           <div className="h-full glass border-r border-white/10 flex flex-col relative">
//             {/* Chat Header */}
//             <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 rounded-lg bg-purple-500/20">
//                   <Bot size={20} className="text-purple-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-white font-medium">AI Assistant</h3>
//                   <p className="text-gray-400 text-sm">Workflow Designer</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setPanelWidth(panelWidth === 25 ? 40 : 25)}
//                   className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
//                 >
//                   {panelWidth === 25 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//                 </button>
//                 <button
//                   onClick={() => handleChatToggle(false)}
//                   className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 p-4 overflow-y-auto">
//               <div className="space-y-4">
//                 {messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex items-start space-x-3 ${
//                       message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//                     }`}
//                   >
//                     <div className={`p-2 rounded-full ${
//                       message.sender === 'user' 
//                         ? 'bg-blue-500/20 text-blue-400' 
//                         : 'bg-purple-500/20 text-purple-400'
//                     }`}>
//                       {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
//                     </div>
//                     <div className={`max-w-xs ${
//                       message.sender === 'user' ? 'text-right' : 'text-left'
//                     }`}>
//                       <div className={`glass rounded-xl p-3 ${
//                         message.sender === 'user' 
//                           ? 'bg-blue-500/10' 
//                           : 'bg-purple-500/10'
//                       }`}>
//                         <div className="prose prose-invert">
//                           <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                             {message.text}
//                           </ReactMarkdown>
//                         </div>


//                       </div>
//                       <p className="text-gray-500 text-xs mt-1">
//                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Input - Fixed at bottom */}
//             <div className="p-4 border-t border-white/10 flex-shrink-0">
//               <div className="glass rounded-xl p-3">
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="text"
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     placeholder="Ask about the workflow..."
//                     className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
//                     onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//                   />
//                   <button
//                     onClick={handleSend}
//                     className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
//                   >
//                     <Send size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Resize Handle */}
//             <div
//               ref={resizeRef}
//               className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-white/10 hover:bg-white/20 transition-colors"
//               onMouseDown={handleResizeStart}
//             />
//           </div>
//         </div>
//       )}

//       {/* Canvas Area */}
//       <div className="flex-1 relative overflow-hidden">
//         <div
//           ref={canvasRef}
//           className="w-full h-full canvas-area"
//           style={{
//             backgroundImage: `
//               radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)
//             `,
//             backgroundSize: '20px 20px',
//             backgroundColor: '#334155',
//             cursor: isDragging ? 'grabbing' : 'grab'
//           }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           onWheel={handleWheel}
//           onClick={handleBackgroundClick}
//         >
//           <svg
//             className="w-full h-full"
//             style={{
//               transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
//               transition: isDragging ? 'none' : 'transform 0.5s ease-out'
//             }}
//           >
//             {renderNode(treeData)}
//           </svg>

//           {/* Combined Zoom Controls */}
//           <div className="absolute top-4 right-4">
//             <div className="glass rounded-xl p-2 flex items-center space-x-2">
//               <button
//                 onClick={() => setZoom(Math.max(minZoom, zoom - 0.2))}
//                 className="p-2 rounded-lg hover:bg-white/20 transition-colors"
//               >
//                 <Minus size={16} className="text-white" />
//               </button>
//               <div className="px-3 py-1 text-white text-sm font-medium min-w-[50px] text-center">
//                 {Math.round(zoom * 100)}%
//               </div>
//               <button
//                 onClick={() => setZoom(Math.min(maxZoom, zoom + 0.2))}
//                 className="p-2 rounded-lg hover:bg-white/20 transition-colors"
//               >
//                 <Plus size={16} className="text-white" />
//               </button>
//             </div>
//           </div>

//           {/* Chat Toggle Button (when chat is hidden) */}
//           {!chatVisible && (
//             <div className="absolute top-4 left-4">
//               <button
//                 onClick={() => handleChatToggle(true)}
//                 className="glass rounded-xl p-3 hover:bg-white/20 transition-colors"
//               >
//                 <Bot size={20} className="text-white" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Side Info Panel */}
//       {selectedNode && selectedNodeData && (
//         <div className="fixed top-0 right-0 w-96 h-full z-50 p-4">
//           <div className="glass rounded-2xl p-6 h-full border border-white/20 bg-white/15 backdrop-blur-xl shadow-2xl overflow-y-auto">
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex items-center space-x-3">
//                 <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedNodeData.color} bg-opacity-30`}>
//                   <selectedNodeData.icon size={24} className="text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-semibold text-white mb-1">{selectedNodeData.label}</h2>
//                   <p className="text-gray-300 text-sm">{selectedNodeData.description}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleCloseInfo}
//                 className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
//               >
//                 <X size={20} className="text-white" />
//               </button>
//             </div>
            
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-medium text-white mb-3">Details</h3>
//                 <p className="text-gray-300 leading-relaxed">{selectedNodeData.details}</p>
//               </div>
              
//               <div className="space-y-3">
//                 <button className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-300 transition-colors font-medium text-left">
//                   Configure Settings
//                 </button>
//                 <button className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-green-300 transition-colors font-medium text-left">
//                   Run Test
//                 </button>
//                 <button className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-300 transition-colors font-medium text-left">
//                   View Logs
//                 </button>
//                 <button className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl text-orange-300 transition-colors font-medium text-left">
//                   Performance Metrics
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useRef, useEffect } from 'react';
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
  const [showInputForm, setShowInputForm] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<Record<string, string>>({});
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

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

        {/* Flow visualization */}
        <div className="flex-1 relative">
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