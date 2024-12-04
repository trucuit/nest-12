// src/common/scoped/logger.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  private logs: string[] = [];

  log(message: string) {
    console.log(`[LoggerService] ${message}`);
    this.logs.push(message);
  }

  getLogs() {
    return this.logs;
  }
}
