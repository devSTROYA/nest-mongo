import { Injectable } from '@nestjs/common';
import { Node, NodeRepository } from '../node.repository';

@Injectable()
export class InMemoryNodeRepository implements NodeRepository {
  private nodes: Node[] = [
    { nodeId: 'id-1', nodeIdentifier: '1234-5678' },
    { nodeId: 'id-2', nodeIdentifier: '1234-5679' },
    { nodeId: 'id-3', nodeIdentifier: '1234-5680' },
    { nodeId: 'id-4', nodeIdentifier: '1234-5681' },
  ]

  getNodeByIdentifier(nodesIdentifier: string): Node {
    const selectedNode = this.nodes.find(node => node.nodeIdentifier === nodesIdentifier);
    return selectedNode ?? null;
  }
}