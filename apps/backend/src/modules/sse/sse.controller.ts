import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { concat, delay, Observable, of } from 'rxjs';

@ApiTags('SSE')
@Controller('sse')
export class SSEController {
  @Sse('stream')
  @ApiOperation({ summary: 'SSE 流式传输' })
  sse(): Observable<MessageEvent> {
    const answerParts = ['这是第一部分回答', '这是第二部分回答', '这是最后一部分回答'];

    const messages: Observable<MessageEvent>[] = [
      of({ data: { type: 'think', content: '正在分析您的问题...' } }),
      ...answerParts.map((content) => of({ data: { type: 'text', content } }).pipe(delay(1000))),
      of({ data: { type: 'recommended', content: '您可能还对以下内容感兴趣...' } }).pipe(
        delay(500),
      ),
      of({ data: { type: 'complete' } }),
    ];

    return concat(...messages);
  }
}
