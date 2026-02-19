import { FlowchartNode, FlowchartEdge } from '../services/storageService';

const VALID_NODE_TYPES = ['start', 'end', 'process', 'decision', 'io', 'loop', 'return'];

export interface ParsedFlowchart {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
    isValid: boolean;
    errors: string[];
}

export const parseFlowchartData = (
    nodes: unknown,
    edges: unknown
): ParsedFlowchart => {
    const errors: string[] = [];
    
    // Validate and sanitize nodes
    const validNodes: FlowchartNode[] = [];
    const nodeIds = new Set<string>();
    
    if (!Array.isArray(nodes)) {
        errors.push('Nodes must be an array');
        return { nodes: [], edges: [], isValid: false, errors };
    }
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i] as Record<string, unknown>;
        
        if (!node.id || typeof node.id !== 'string') {
            errors.push(`Node at index ${i} missing valid id`);
            continue;
        }
        
        if (nodeIds.has(node.id)) {
            errors.push(`Duplicate node id: ${node.id}`);
            continue;
        }
        nodeIds.add(node.id);
        
        const type = (node.type as string)?.toLowerCase();
        if (!VALID_NODE_TYPES.includes(type)) {
            errors.push(`Node "${node.id}" has invalid type: ${node.type}. Defaulting to "process"`);
        }
        
        validNodes.push({
            id: node.id,
            label: String(node.label || 'Unknown'),
            type: (VALID_NODE_TYPES.includes(type) ? type : 'process') as FlowchartNode['type'],
        });
    }
    
    // Validate and sanitize edges
    const validEdges: FlowchartEdge[] = [];
    
    if (!Array.isArray(edges)) {
        errors.push('Edges must be an array');
        return { nodes: validNodes, edges: [], isValid: false, errors };
    }
    
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i] as Record<string, unknown>;
        
        const fromNode = String(edge.from);
        const toNode = String(edge.to);
        
        if (!fromNode || !toNode) {
            errors.push(`Edge at index ${i} missing from/to`);
            continue;
        }
        
        if (!nodeIds.has(fromNode)) {
            errors.push(`Edge "${fromNode}" -> "${toNode}" references unknown source node`);
            continue;
        }
        
        if (!nodeIds.has(toNode)) {
            errors.push(`Edge "${fromNode}" -> "${toNode}" references unknown target node`);
            continue;
        }
        
        validEdges.push({
            from: fromNode,
            to: toNode,
            label: edge.label ? String(edge.label) : undefined,
        });
    }
    
    // Check for start and end nodes
    const hasStart = validNodes.some(n => n.type === 'start');
    const hasEnd = validNodes.some(n => n.type === 'end' || n.type === 'return');
    
    if (!hasStart) {
        errors.push('Missing start node');
    }
    if (!hasEnd) {
        errors.push('Missing end/return node');
    }
    
    return {
        nodes: validNodes,
        edges: validEdges,
        isValid: errors.length === 0,
        errors,
    };
};

export const createDefaultFlowchart = (): ParsedFlowchart => ({
    nodes: [
        { id: 'N1', label: 'Start', type: 'start' },
        { id: 'N2', label: 'No Flowchart Data', type: 'process' },
    ],
    edges: [
        { from: 'N1', to: 'N2' },
    ],
    isValid: true,
    errors: [],
});
