import { Injectable } from '@nestjs/common';

export type Node = {
  nodeId: string;
  nodeIdentifier: string;
}

@Injectable()
export abstract class NodeRepository {
  abstract getNodeByIdentifier(nodesIdentifier: string): Node;
}