import { Module } from '@nestjs/common';

import { AuthenticationModule } from '@ssampong-nest/authentication';

@Module({
  imports: [AuthenticationModule],
})
export class AppModule {}
