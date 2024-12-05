// src/transient/transient.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private readonly createdAt: number;

  constructor() {
    this.createdAt = Date.now();
    console.log('TransientService instance created at', this.createdAt);
  }

  getCreatedAt(): number {
    return this.createdAt;
  }
}
