'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronLeft, ChevronRight, Database, Code, Workflow, Settings, CheckCircle, X, Minus, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import remarkGfm      from 'remark-gfm'

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface TreeNode {
  id: string;
  label: string;
  description: string;
  details: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: any;
  color: string;
  children?: TreeNode[];
}

export default function AppsPage() {
  const [chatVisible, setChatVisible] = useState(false); // Start closed
  const [panelWidth, setPanelWidth] = useState(25); // 25% default
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm here to help you with your workflow design. What would you like to create?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [savedFocusState, setSavedFocusState] = useState<{
    panOffset: { x: number; y: number };
    zoom: number;
    selectedNode: string | null;
    focusedNode: string | null;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const treeData: TreeNode = {
    id: 'main',
    label: 'Main Process',
    description: 'Core workflow orchestration',
    details: 'This is the central hub of your workflow system. It coordinates all other processes and manages the overall execution flow. Configure triggers, set up monitoring, and define success criteria here.',
    x: 900,
    y: 250,
    width: 200,
    height: 120,
    icon: Workflow,
    color: 'from-purple-500 to-blue-500',
    children: [
      {
        id: 'data',
        label: 'Data Processing',
        description: 'Input validation & transformation',
        details: 'Handles all incoming data streams, validates formats, transforms data structures, and ensures data quality before processing. Supports multiple input formats and real-time streaming.',
        x: 650,
        y: 150,
        width: 160,
        height: 100,
        icon: Database,
        color: 'from-green-500 to-teal-500'
      },
      {
        id: 'logic',
        label: 'Business Logic',
        description: 'Core processing engine',
        details: 'Contains the main business rules and processing algorithms. This module handles complex decision-making, rule evaluation, and core computational tasks.',
        x: 650,
        y: 280,
        width: 160,
        height: 100,
        icon: Code,
        color: 'from-orange-500 to-red-500',
        children: [
          {
            id: 'validation',
            label: 'Validation',
            description: 'Data integrity checks',
            details: 'Performs comprehensive validation of all data inputs and intermediate results. Includes schema validation, business rule checks, and data quality assessments.',
            x: 450,
            y: 230,
            width: 140,
            height: 80,
            icon: CheckCircle,
            color: 'from-blue-500 to-indigo-500'
          },
          {
            id: 'processing',
            label: 'Processing',
            description: 'Algorithm execution',
            details: 'Executes the core algorithms and computational processes. Handles parallel processing, optimization routines, and complex calculations with high performance.',
            x: 450,
            y: 330,
            width: 140,
            height: 80,
            icon: Settings,
            color: 'from-pink-500 to-rose-500'
          }
        ]
      },
      {
        id: 'output',
        label: 'Output Handler',
        description: 'Result formatting & delivery',
        details: 'Manages all output operations including result formatting, delivery to various endpoints, notification systems, and integration with external services.',
        x: 650,
        y: 410,
        width: 160,
        height: 100,
        icon: Send,
        color: 'from-cyan-500 to-blue-500'
      }
    ]
  };

  const maxPanDistance = 500;
  const minZoom = 0.5;
  const maxZoom = 2;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I can help you design and optimize your workflow. Would you like me to explain any of the nodes in your diagram or suggest improvements?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-area')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(-maxPanDistance, Math.min(maxPanDistance, e.clientX - dragStart.x));
      const newY = Math.max(-maxPanDistance, Math.min(maxPanDistance, e.clientY - dragStart.y));
      setPanOffset({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
    setZoom(newZoom);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setFocusedNode(nodeId);
    
    // Find the node and animate to focus on it
    const findNode = (node: TreeNode): TreeNode | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    const targetNode = findNode(treeData);
    if (targetNode) {
      // Calculate center position accounting for right panel
      const rightPanelWidth = 400; // Width of the right info panel
      const availableWidth = window.innerWidth - (chatVisible ? window.innerWidth * panelWidth / 100 : 0) - rightPanelWidth;
      const centerX = -targetNode.x - targetNode.width / 2 + (chatVisible ? window.innerWidth * panelWidth / 100 : 0) + availableWidth / 2;
      const centerY = -targetNode.y - targetNode.height / 2 + window.innerHeight / 2;
      
      setTimeout(() => {
        setPanOffset({ 
          x: Math.max(-maxPanDistance, Math.min(maxPanDistance, centerX)), 
          y: Math.max(-maxPanDistance, Math.min(maxPanDistance, centerY))
        });
        setZoom(1.2);
      }, 50);
    }
  };

  const handleCloseInfo = () => {
    setSelectedNode(null);
    setFocusedNode(null);
    // Smooth animation back to original position
    setTimeout(() => {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }, 50);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-area')) {
      if (focusedNode) {
        handleCloseInfo();
      }
    }
  };

  // Handle chat visibility with focus state preservation
  const handleChatToggle = (visible: boolean) => {
    if (visible && (selectedNode || focusedNode)) {
      // Save current focus state before opening chat
      setSavedFocusState({
        panOffset: { ...panOffset },
        zoom,
        selectedNode,
        focusedNode
      });
    } else if (!visible && savedFocusState) {
      // Restore focus state when closing chat
      setTimeout(() => {
        setPanOffset(savedFocusState.panOffset);
        setZoom(savedFocusState.zoom);
        setSelectedNode(savedFocusState.selectedNode);
        setFocusedNode(savedFocusState.focusedNode);
        setSavedFocusState(null);
      }, 100);
    }
    setChatVisible(visible);
  };

  // Panel resizing logic with navigation bar constraint
  const handleResizeStart = (e: React.MouseEvent) => {
    if (chatVisible) {
      setIsResizing(true);
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (isResizing && chatVisible) {
        const navBarHeight = 80; // Navigation bar height
        const maxAllowedWidth = Math.min(45, ((window.innerHeight - navBarHeight) / window.innerHeight) * 45);
        const newWidth = Math.min(maxAllowedWidth, Math.max(20, (e.clientX / window.innerWidth) * 100));
        setPanelWidth(newWidth);
      }
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, chatVisible]);

  const getConnectionPath = (from: TreeNode, to: TreeNode) => {
    const fromCenterX = from.x + from.width / 2;
    const fromCenterY = from.y + from.height / 2;
    const toCenterX = to.x + to.width / 2;
    const toCenterY = to.y + to.height / 2;
    
    // Determine connection points based on relative positions
    let fromX, fromY, toX, toY;
    
    if (fromCenterX > toCenterX) {
      // Parent is to the right of child
      fromX = from.x;
      fromY = fromCenterY;
      toX = to.x + to.width;
      toY = toCenterY;
    } else {
      // Parent is to the left of child
      fromX = from.x + from.width;
      fromY = fromCenterY;
      toX = to.x;
      toY = toCenterY;
    }
    
    const midX = (fromX + toX) / 2;
    
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  };

  const renderNode = (node: TreeNode, parentNode?: TreeNode) => {
    const Icon = node.icon;
    const isSelected = selectedNode === node.id;
    const isFocused = focusedNode === node.id;
    
    return (
      <g key={node.id}>
        {/* Connection line to parent */}
        {parentNode && (
          <path
            d={getConnectionPath(parentNode, node)}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Node */}
        <g
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleNodeClick(node.id);
          }}
        >
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx="12"
            ry="12"
            fill="rgba(255, 255, 255, 0.12)"
            stroke={isFocused ? 'rgba(255, 255, 255, 0.8)' : isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)'}
            strokeWidth={isFocused ? '3' : isSelected ? '2' : '1'}
          />
          
          {/* Node content */}
          <foreignObject 
            x={node.x + 16} 
            y={node.y + 16} 
            width={node.width - 32} 
            height={node.height - 32}
          >
            <div className="flex flex-col h-full select-none">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${node.color} bg-opacity-20`}>
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="text-white text-sm font-medium truncate">{node.label}</h3>
              </div>
              <p className="text-gray-300 text-xs leading-tight flex-1">{node.description}</p>
              {node.id === 'main' && (
                <div className="flex space-x-1 mt-2">
                  <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
                    Configure
                  </button>
                  <button className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">
                    Run
                  </button>
                </div>
              )}
            </div>
          </foreignObject>
        </g>
        
        {/* Render children */}
        {node.children?.map(child => renderNode(child, node))}
      </g>
    );
  };

  const getSelectedNodeData = () => {
    const findNode = (node: TreeNode): TreeNode | null => {
      if (node.id === selectedNode) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(treeData);
  };

  const selectedNodeData = getSelectedNodeData();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* AI Chat Panel */}
      {chatVisible && (
        <div 
          className="flex-shrink-0 transition-all duration-300 z-30 h-screen"
          style={{ 
            width: `${panelWidth}%`
          }}
        >
          <div className="h-full glass border-r border-white/10 flex flex-col relative">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Bot size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">AI Assistant</h3>
                  <p className="text-gray-400 text-sm">Workflow Designer</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPanelWidth(panelWidth === 25 ? 40 : 25)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {panelWidth === 25 ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button
                  onClick={() => handleChatToggle(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.sender === 'user' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-xs ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`glass rounded-xl p-3 ${
                        message.sender === 'user' 
                          ? 'bg-blue-500/10' 
                          : 'bg-purple-500/10'
                      }`}>
                        <div className="prose prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.text}
                          </ReactMarkdown>
                        </div>


                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input - Fixed at bottom */}
            <div className="p-4 border-t border-white/10 flex-shrink-0">
              <div className="glass rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about the workflow..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Resize Handle */}
            <div
              ref={resizeRef}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-white/10 hover:bg-white/20 transition-colors"
              onMouseDown={handleResizeStart}
            />
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full canvas-area"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)
            `,
            backgroundSize: '20px 20px',
            backgroundColor: '#334155',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleBackgroundClick}
        >
          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.5s ease-out'
            }}
          >
            {renderNode(treeData)}
          </svg>

          {/* Combined Zoom Controls */}
          <div className="absolute top-4 right-4">
            <div className="glass rounded-xl p-2 flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(minZoom, zoom - 0.2))}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Minus size={16} className="text-white" />
              </button>
              <div className="px-3 py-1 text-white text-sm font-medium min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </div>
              <button
                onClick={() => setZoom(Math.min(maxZoom, zoom + 0.2))}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Chat Toggle Button (when chat is hidden) */}
          {!chatVisible && (
            <div className="absolute top-4 left-4">
              <button
                onClick={() => handleChatToggle(true)}
                className="glass rounded-xl p-3 hover:bg-white/20 transition-colors"
              >
                <Bot size={20} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Info Panel */}
      {selectedNode && selectedNodeData && (
        <div className="fixed top-0 right-0 w-96 h-full z-50 p-4">
          <div className="glass rounded-2xl p-6 h-full border border-white/20 bg-white/15 backdrop-blur-xl shadow-2xl overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedNodeData.color} bg-opacity-30`}>
                  <selectedNodeData.icon size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">{selectedNodeData.label}</h2>
                  <p className="text-gray-300 text-sm">{selectedNodeData.description}</p>
                </div>
              </div>
              <button
                onClick={handleCloseInfo}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Details</h3>
                <p className="text-gray-300 leading-relaxed">{selectedNodeData.details}</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-300 transition-colors font-medium text-left">
                  Configure Settings
                </button>
                <button className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-green-300 transition-colors font-medium text-left">
                  Run Test
                </button>
                <button className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-300 transition-colors font-medium text-left">
                  View Logs
                </button>
                <button className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl text-orange-300 transition-colors font-medium text-left">
                  Performance Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}