import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';

@Module({
  controllers: [RagController],
  providers: [EmbeddingService, VectorStoreService],
  exports: [EmbeddingService, VectorStoreService],
})
export class RagModule {}
