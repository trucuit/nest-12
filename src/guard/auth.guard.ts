import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
function validateRequest(request: any): boolean {
  // const authHeader = request.headers['authorization'];

  // if (!authHeader) {
  //   return false;
  // }

  // // Basic validation of Bearer token
  // const [type, token] = authHeader.split(' ');
  // if (type !== 'Bearer' || !token) {
  //   return false;
  // }

  return true;
}
