import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailQueueProcessor } from './mail-queue.processor';
import { MailQueueService } from './mail-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue', // Name of the queue
    }),
  ],
  providers: [MailQueueService, MailQueueProcessor],
  exports: [MailQueueService], // Export for other modules
})
export class MailQueueModule {}
