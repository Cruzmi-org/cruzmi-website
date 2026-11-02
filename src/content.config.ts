import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const textItem = z.object({ title: z.string(), text: z.string() });

/** Home page copy, one YAML file per locale (src/content/home/<locale>.yaml). */
const home = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    hero: z.object({
      titleBefore: z.string(),
      titleHighlight: z.string(),
      titleAfter: z.string(),
      subtitle: z.string(),
      lead: z.string(),
      tagline: z.string(),
      imageAlt: z.string(),
    }),
    pillars: z.array(textItem.extend({ icon: z.enum(['users', 'calendar', 'map', 'camera']) })).length(4),
    useCases: z.object({ title: z.string(), items: z.array(textItem) }),
    audiences: z.object({ title: z.string(), intro: z.string(), items: z.array(textItem) }),
    howItWorks: z.object({
      title: z.string(),
      intro: z.string(),
      steps: z.array(z.object({ label: z.string(), title: z.string(), points: z.array(z.string()) })),
    }),
    download: z.object({ title: z.string(), text: z.string() }),
  }),
});

export const collections = { home };
