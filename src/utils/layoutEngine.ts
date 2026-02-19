import dagre from 'dagre';
import { FlowchartNode, FlowchartEdge } from '../services/storageService';

export interface LayoutedNode extends FlowchartNode {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface LayoutedEdge extends FlowchartEdge {
    points: { x: number; y: number }[];
}

export interface LayoutedFlowchart {
    nodes: LayoutedNode[];
    edges: LayoutedEdge[];
}

const CHAR_WIDTH = 8;
const LINE_HEIGHT = 18;
const PADDING_HORIZONTAL = 20;
const PADDING_VERTICAL = 16;

const MIN_NODE_WIDTH = 100;
const MAX_NODE_WIDTH = 220;
const MIN_NODE_HEIGHT = 40;
const DIAMOND_SIZE = 80;

const estimateNodeSize = (node: FlowchartNode): { width: number; height: number } => {
    const { label, type } = node;
    
    if (type === 'decision') {
        return { width: DIAMOND_SIZE, height: DIAMOND_SIZE };
    }
    
    if (type === 'start' || type === 'end') {
        return { width: 100, height: 40 };
    }
    
    const charsPerLine = Math.floor((MAX_NODE_WIDTH - PADDING_HORIZONTAL) / CHAR_WIDTH);
    const lines = Math.ceil(label.length / charsPerLine);
    const estimatedWidth = Math.min(
        Math.max(label.length * CHAR_WIDTH + PADDING_HORIZONTAL, MIN_NODE_WIDTH),
        MAX_NODE_WIDTH
    );
    const height = Math.max(lines * LINE_HEIGHT + PADDING_VERTICAL, MIN_NODE_HEIGHT);
    
    return { width: estimatedWidth, height };
};

export const getLayoutedElements = (
    nodes: FlowchartNode[],
    edges: FlowchartEdge[]
): LayoutedFlowchart => {
    if (nodes.length === 0) {
        return { nodes: [], edges: [] };
    }
    
    const g = new dagre.graphlib.Graph();
    g.setGraph({
        rankdir: 'TB',
        nodesep: 50,
        ranksep: 80,
        marginx: 20,
        marginy: 20,
    });
    g.setDefaultEdgeLabel(() => ({}));
    
    // Add nodes with estimated sizes
    nodes.forEach(node => {
        const size = estimateNodeSize(node);
        g.setNode(node.id, { 
            ...node, 
            width: size.width, 
            height: size.height 
        });
    });
    
    // Add edges
    edges.forEach(edge => {
        g.setEdge(edge.from, edge.to, { label: edge.label });
    });
    
    // Run layout
    dagre.layout(g);
    
    // Extract layouted nodes
    const layoutedNodes: LayoutedNode[] = g.nodes().map(id => {
        const node = g.node(id);
        if (!node) return null;
        
        const originalNode = nodes.find(n => n.id === id);
        
        return {
            id: id,
            label: originalNode?.label || node.label || '',
            type: originalNode?.type || 'process',
            x: node.x - node.width / 2,
            y: node.y - node.height / 2,
            width: node.width,
            height: node.height,
        };
    }).filter(Boolean) as LayoutedNode[];
    
    // Extract layouted edges
    const layoutedEdges: LayoutedEdge[] = g.edges().map(e => {
        const edge = g.edge(e);
        if (!edge) return null;
        
        const originalEdge = edges.find(ed => ed.from === e.v && ed.to === e.w);
        
        return {
            from: e.v,
            to: e.w,
            label: originalEdge?.label || edge.label || undefined,
            points: edge.points || [],
        };
    }).filter(Boolean) as LayoutedEdge[];
    
    return {
        nodes: layoutedNodes,
        edges: layoutedEdges,
    };
};

export const calculateViewBox = (
    nodes: LayoutedNode[],
    padding: number = 40
): string => {
    if (nodes.length === 0) {
        return "0 0 500 600";
    }
    
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const widths = nodes.map(n => n.width);
    const heights = nodes.map(n => n.height);
    
    const minX = Math.min(...xs) - padding;
    const minY = Math.min(...ys) - padding;
    const maxX = Math.max(...xs.map((x, i) => x + widths[i])) + padding;
    const maxY = Math.max(...ys.map((y, i) => y + heights[i])) + padding;
    
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
};
