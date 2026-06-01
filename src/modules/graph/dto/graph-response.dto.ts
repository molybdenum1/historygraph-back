export interface GraphNodeDto {
  id: string;
  type: string;
  label: string;
}

export interface GraphEdgeDto {
  source: string;
  target: string;
  relationType: string;
}

export interface GraphResponseDto {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
}
