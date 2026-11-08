import type { ComponentType } from 'react';
import type { DiagramProps } from './base';
import { Spark } from './Spark';
import { CpuDiagram, CPU_PARTS } from './CpuDiagram';
import { BinaryDiagram, BINARY_PARTS } from './BinaryDiagram';
import { CompileDiagram, COMPILE_PARTS } from './CompileDiagram';
import { NetworkDiagram, NETWORK_PARTS } from './NetworkDiagram';
import { PerfDiagram, PERF_PARTS } from './PerfDiagram';
import { VarDiagram, VAR_PARTS } from './VarDiagram';
import { ScopeDiagram, SCOPE_PARTS } from './ScopeDiagram';
import { PointerDiagram, POINTER_PARTS } from './PointerDiagram';
import { DataStructDiagram, DS_PARTS } from './DataStructDiagram';
import { LangModelDiagram, LANGMODEL_PARTS } from './LangModelDiagram';
import { ProcessDiagram, PROCESS_PARTS } from './ProcessDiagram';
import { MemoryDiagram, MEMORY_PARTS } from './MemoryDiagram';
import { FsDiagram, FS_PARTS } from './FsDiagram';
import { PermDiagram, PERM_PARTS } from './PermDiagram';
import { CliDiagram, CLI_PARTS } from './CliDiagram';
import { CryptoDiagram, CRYPTO_PARTS } from './CryptoDiagram';
import { WebAttackDiagram, WEB_PARTS } from './WebAttackDiagram';
import { TlsDiagram, TLS_PARTS } from './TlsDiagram';
import { AuthDiagram, AUTH_PARTS } from './AuthDiagram';
import { DefenseDiagram, DEFENSE_PARTS } from './DefenseDiagram';

import { DbTableDiagram, DB_TABLE_PARTS, DbQueryDiagram, DB_QUERY_PARTS, DbIndexDiagram, DB_INDEX_PARTS, DbTransactionDiagram, DB_TRANSACTION_PARTS, DbModelDiagram, DB_MODEL_PARTS } from './DatabaseDiagrams';

export interface DiagramSpec {
  Component: ComponentType<DiagramProps>;
  /** 这张图里可以被 focus 点亮的图元 id */
  parts: string[];
}

const REGISTRY: Record<string, DiagramSpec> = {
  spark: { Component: Spark, parts: [] },
  'db-table': { Component: DbTableDiagram, parts: DB_TABLE_PARTS },
  'db-query': { Component: DbQueryDiagram, parts: DB_QUERY_PARTS },
  'db-index': { Component: DbIndexDiagram, parts: DB_INDEX_PARTS },
  'db-transaction': { Component: DbTransactionDiagram, parts: DB_TRANSACTION_PARTS },
  'db-model': { Component: DbModelDiagram, parts: DB_MODEL_PARTS },
  cpu: { Component: CpuDiagram, parts: CPU_PARTS },
  binary: { Component: BinaryDiagram, parts: BINARY_PARTS },
  compile: { Component: CompileDiagram, parts: COMPILE_PARTS },
  network: { Component: NetworkDiagram, parts: NETWORK_PARTS },
  perf: { Component: PerfDiagram, parts: PERF_PARTS },
  variable: { Component: VarDiagram, parts: VAR_PARTS },
  scope: { Component: ScopeDiagram, parts: SCOPE_PARTS },
  pointer: { Component: PointerDiagram, parts: POINTER_PARTS },
  datastruct: { Component: DataStructDiagram, parts: DS_PARTS },
  langmodel: { Component: LangModelDiagram, parts: LANGMODEL_PARTS },
  process: { Component: ProcessDiagram, parts: PROCESS_PARTS },
  memory: { Component: MemoryDiagram, parts: MEMORY_PARTS },
  filesystem: { Component: FsDiagram, parts: FS_PARTS },
  permission: { Component: PermDiagram, parts: PERM_PARTS },
  cli: { Component: CliDiagram, parts: CLI_PARTS },
  crypto: { Component: CryptoDiagram, parts: CRYPTO_PARTS },
  webattack: { Component: WebAttackDiagram, parts: WEB_PARTS },
  tls: { Component: TlsDiagram, parts: TLS_PARTS },
  auth: { Component: AuthDiagram, parts: AUTH_PARTS },
  defense: { Component: DefenseDiagram, parts: DEFENSE_PARTS },
};

/** 未知 key 回落到 Spark，保证卡片永远有图可看。 */
export function getIllustration(key: string): ComponentType<DiagramProps> {
  return REGISTRY[key]?.Component ?? Spark;
}

/** 卡片 steps 里写的 focus 必须是这些 id 之一，否则高亮不生效。 */
export function getDiagramParts(key: string): string[] {
  return REGISTRY[key]?.parts ?? [];
}

export function hasIllustration(key: string): boolean {
  return key in REGISTRY;
}

/** 供测试遍历，确保每个图都能渲染、每张卡的 focus 都有出处。 */
export const ILLUSTRATION_KEYS = Object.keys(REGISTRY);

export { Spark };
