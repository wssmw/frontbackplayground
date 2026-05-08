import { Injectable } from '@nestjs/common';
interface OllamaEmbeddingResponse {
  embedding: number[];
}

@Injectable()
export class EmbeddingService {
  async getEmbedding(text: string): Promise<number[]> {
    const response = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'bge-m3',
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embedding request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaEmbeddingResponse;

    return data.embedding;
  }
}
