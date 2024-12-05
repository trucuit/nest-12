// src/transient/transient.module.ts
import { Module, Scope } from '@nestjs/common';
import { TransientService } from './transient.service';

@Module({
  providers: [
    {
      provide: TransientService,
      useClass: TransientService,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [TransientService],
})
export class TransientModule {}
