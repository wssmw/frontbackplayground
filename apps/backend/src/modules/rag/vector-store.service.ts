import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

interface VectorPoint {
  id: string;
  text: string;
  vector: number[];
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface VectorSearchItem {
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class VectorStoreService {
  private readonly points: VectorPoint[] = [];

  async upsertText(params: {
    id?: string;
    text: string;
    vector: number[];
    metadata?: Record<string, unknown>;
  }): Promise<{ id: string }> {
    const id = params.id ?? randomUUID();

    const existingIndex = this.points.findIndex((p) => p.id === id);

    const point: VectorPoint = {
      id,
      text: params.text,
      vector: params.vector,
      metadata: params.metadata,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.points[existingIndex] = point;
    } else {
      this.points.push(point);
    }

    return { id };
  }

  async search(vector: number[], limit = 5): Promise<VectorSearchItem[]> {
    if (this.points.length === 0) {
      return [];
    }

    const results = this.points
      .map((point) => ({
        id: point.id,
        score: this.cosineSimilarity(vector, point.vector),
        text: point.text,
        metadata: point.metadata,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vector dimensions must match');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }

  // 调试用：查看当前存了多少条数据
  getStats() {
    return {
      totalPoints: this.points.length,
      vectorDimension: this.points,
    };
  }
}
