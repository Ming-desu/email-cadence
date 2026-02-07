import { Injectable } from '@nestjs/common';
import { Cadence } from '@email-cadence/shared';

@Injectable()
export class CadencesService {
  private store = new Map<string, Cadence>();

  create(cadence: Cadence) {
    this.store.set(cadence.id, cadence);
    return cadence;
  }

  get(id: string) {
    return this.store.get(id);
  }

  update(id: string, cadence: Cadence) {
    if (this.store.get(id) === undefined) {
      throw new Error('Cadence does not exists.');
    }

    this.store.set(id, cadence);
    return cadence;
  }
}
