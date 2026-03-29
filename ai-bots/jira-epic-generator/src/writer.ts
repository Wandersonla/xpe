import * as fs from 'fs';
import * as path from 'path';
import { EpicGeneratorResult } from './types';

export function writeOutput(
  content: string,
  outputPath: string,
  durationMs: number,
): EpicGeneratorResult {
  const resolved = path.resolve(outputPath);
  const dir = path.dirname(resolved);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(resolved, content, 'utf-8');

  const epicMatches = content.match(/EPIC-\d{2}/g) ?? [];
  const epicCount = new Set(epicMatches).size;
  const storyCount = (content.match(/\*\*US-\d{3}\*\*/g) ?? []).length;

  return { outputPath: resolved, epicCount, storyCount, durationMs };
}
