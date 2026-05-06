import { InjectionJobModel } from "./injectionJob.model.ts";
import { executeInjectionForSupermarket } from "./injection.service.ts";
import logger from "../../shared/utils/logger.ts";

const TICK_MS = 60_000;
const inFlight = new Set<string>();
let started = false;

async function tick(): Promise<void> {
  try {
    const jobs = await InjectionJobModel.find({ status: "connected" }).select("supermarketId").lean();
    for (const job of jobs) {
      const id = String(job.supermarketId);
      if (inFlight.has(id)) continue;
      inFlight.add(id);
      void executeInjectionForSupermarket(id)
        .catch((err: unknown) => {
          logger.error("Scheduled injection failed", {
            supermarketId: id,
            error: err instanceof Error ? err.message : String(err),
          });
        })
        .finally(() => {
          inFlight.delete(id);
        });
    }
  } catch (e: unknown) {
    logger.error("Injection scheduler tick error", {
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

/** Call once after server is listening (DB must be connected). */
export function startInjectionScheduler(): void {
  if (started) return;
  started = true;
  setInterval(() => {
    void tick();
  }, TICK_MS);
  logger.info("Injection scheduler started", { intervalMs: TICK_MS });
}

/**
 * Run a single injection immediately (e.g. after Connect).
 * Uses same in-flight guard as the scheduler per supermarket.
 */
export async function runInjectionOnceNow(supermarketId: string): Promise<void> {
  const id = String(supermarketId);
  if (inFlight.has(id)) {
    return;
  }
  inFlight.add(id);
  try {
    await executeInjectionForSupermarket(id);
  } finally {
    inFlight.delete(id);
  }
}
