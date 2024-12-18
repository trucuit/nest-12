import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as sendGridMail from '@sendgrid/mail';

@Processor('mail-queue') // Name of the queue
export class MailQueueProcessor {
  constructor() {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY); // Set SendGrid API Key
  }

  @Process() // Processes jobs in the queue
  async handleSendMail(job: Job) {
    const { email, subject, content } = job.data;

    try {
      // await sendGridMail.send({
      //   to: email,
      //   from: process.env.SENDGRID_SENDER_EMAIL,
      //   subject,
      //   text: content,
      //   html: `<strong>${content}</strong>`,
      // });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(
        `mail-queue.processor Failed to send email to ${email}`,
        error.message,
      );
    }
  }
}
