"use client";
import { useStore } from "@/store/AppStore";
import type { LogEntry } from "@/lib/types";
import { LogTableRaw } from "./LogTableRaw";

export function LogTable({ filter }: { filter?: (l: LogEntry) => boolean }) {
  const { logs } = useStore();
  return <LogTableRaw logs={filter ? logs.filter(filter) : logs} />;
}
