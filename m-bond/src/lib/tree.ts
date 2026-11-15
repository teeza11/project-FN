import type { OutlineNode } from "./types";

let seq = 100;
export const uid = () => `n${++seq}`;
export const node = (t: string, c: OutlineNode[] = []): OutlineNode => ({ id: uid(), t, c });

export const flatten = (a: OutlineNode[]): OutlineNode[] => a.flatMap((n) => [n, ...flatten(n.c)]);
export const cloneTree = (a: OutlineNode[]): OutlineNode[] =>
  a.map((n) => ({ id: n.id, t: n.t, c: cloneTree(n.c) }));

export interface Found { arr: OutlineNode[]; i: number; n: OutlineNode }
export function find(a: OutlineNode[], id: string): Found | null {
  for (let i = 0; i < a.length; i++) {
    if (a[i].id === id) return { arr: a, i, n: a[i] };
    const r = find(a[i].c, id);
    if (r) return r;
  }
  return null;
}

/** รายการพร้อมเลขหัวข้อ (1, 1.1, 1.2, 2 ...) และระดับความลึก */
export interface Row { n: OutlineNode; no: string; depth: number; i: number; siblings: OutlineNode[] }
export function rows(a: OutlineNode[], prefix = "", depth = 0): Row[] {
  return a.flatMap((n, i) => {
    const no = `${prefix}${i + 1}`;
    return [{ n, no, depth, i, siblings: a }, ...rows(n.c, `${no}.`, depth + 1)];
  });
}
