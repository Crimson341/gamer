import { z } from "zod";

export const clarityConfigSchema = z.object({
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  tsconfig: z.string().optional(),
  outputDir: z.string().optional(),
  cacheDir: z.string().optional(),
  gitDepth: z.number().int().positive().optional(),
  complexityThreshold: z.number().int().positive().optional(),
});

export type ClarityConfigInput = z.infer<typeof clarityConfigSchema>;
