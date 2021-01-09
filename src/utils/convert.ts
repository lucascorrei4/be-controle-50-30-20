/* eslint-disable import/prefer-default-export */
import { readFile } from 'fs';
import { promisify } from 'util';

export const imgTobase64 = async (path: string): Promise<string> =>
  `data:image/png;base64, ${await promisify(readFile)(path, 'base64')}`;
