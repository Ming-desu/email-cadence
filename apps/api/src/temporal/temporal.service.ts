import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Connection } from '@temporalio/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TemporalService implements OnModuleInit {
  client: Client | undefined = undefined;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const connection = await Connection.connect({
      address: this.config.get('TEMPORAL_ADDRESS'),
    });

    this.client = new Client({
      connection,
      namespace: this.config.get('TEMPORAL_NAMESPACE'),
    });
  }
}
