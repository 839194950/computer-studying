import type { ComponentType } from 'react';
import { Spark } from './Spark';
import { Pointer } from './Pointer';
import { Binary } from './Binary';
import { Process } from './Process';
import { Hash } from './Hash';

type Illustration = ComponentType<{ className?: string }>;

const REGISTRY: Record<string, Illustration> = {
  spark: Spark,
  pointer: Pointer,
  binary: Binary,
  process: Process,
  hash: Hash,
};

/** 未知 key 回落到 Spark，保证卡片永远有图可看。 */
export function getIllustration(key: string): Illustration {
  return REGISTRY[key] ?? Spark;
}

export { Spark, Pointer, Binary, Process, Hash };
