import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmbeddingService } from './embedding.service';
import { SearchRagTextDto } from './search-rag-text.dto';
import { UpsertRagTextDto } from './upsert-rag-text.dto';
import { VectorStoreService } from './vector-store.service';

@ApiTags('RAG')
@Controller('rag')
export class RagController {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  @Post('upsert')
  async upsert(@Body() body: UpsertRagTextDto): Promise<{ id: string }> {
    const vector = await this.embeddingService.getEmbedding(body.text);
    
    return this.vectorStoreService.upsertText({
      id: body.id,
      text: body.text,
      vector,
      metadata: body.metadata,
    });
  }

  @Post('search')
  async search(@Body() body: SearchRagTextDto) {
    const vector = await this.embeddingService.getEmbedding(body.query);
    return this.vectorStoreService.search(vector, body.limit ?? 5);
  }
}
