import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';

@Injectable()
export class MailQueueService {
  private readonly logger = new Logger(MailQueueService.name);

  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  async addToQueue(email: string, subject: string, content: string) {
    await this.mailQueue.add({
      email,
      subject,
      content,
    });
    this.logger.log(`Email task added to queue for ${email}`);
  }
}
