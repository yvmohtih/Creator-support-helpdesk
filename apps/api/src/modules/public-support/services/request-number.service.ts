import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class RequestNumberService {
  generate(date = new Date()) {
    const year = date.getUTCFullYear();
    let suffix = '';

    for (let index = 0; index < 6; index += 1) {
      suffix += alphabet[randomInt(alphabet.length)];
    }

    return `RB-${year}-${suffix}`;
  }
}
