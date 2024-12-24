import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { MailQueueService } from './mail-queue.service';
import { Logger } from '@nestjs/common';

describe('MailQueueService', () => {
  let service: MailQueueService;
  let mockQueue;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailQueueService,
        {
          provide: getQueueToken('mail-queue'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<MailQueueService>(MailQueueService);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToQueue', () => {
    it('should add email to queue successfully', async () => {
      const email = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      await service.addToQueue(email, subject, content);

      expect(mockQueue.add).toHaveBeenCalledWith({
        email,
        subject,
        content,
      });
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Email task added to queue for ${email}`,
      );
    });

    it('should handle queue errors', async () => {
      const email = 'test@example.com';
      mockQueue.add.mockRejectedValue(new Error('Queue error'));

      await expect(
        service.addToQueue(email, 'subject', 'content'),
      ).rejects.toThrow('Queue error');
    });
  });
});
