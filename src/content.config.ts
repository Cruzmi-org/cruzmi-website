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

/** Features page copy (src/content/features/<locale>.yaml). */
const features = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/features' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    intro: z.object({ title: z.string(), text: z.string() }),
    features: z.array(
      z.object({
        id: z.string(),
        image: z.enum(['programme', 'map', 'budget', 'meals', 'shopping', 'participants', 'photos', 'albums']),
        kicker: z.string(),
        title: z.string(),
        text: z.string(),
        points: z.array(z.string()),
      }),
    ),
    more: z.object({
      title: z.string(),
      items: z.array(textItem.extend({ icon: z.enum(['checklist', 'sliders', 'idea', 'devices']) })),
    }),
    download: z.object({ title: z.string(), text: z.string() }),
  }),
});

/** FAQ copy (src/content/faq/<locale>.yaml). Answers: blank line = paragraph, "• " lines = list. */
const faq = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/faq' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    intro: z.object({ title: z.string(), text: z.string() }),
    categories: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        items: z.array(z.object({ q: z.string(), a: z.string() })),
      }),
    ),
    contact: z.object({ title: z.string(), text: z.string(), button: z.string() }),
  }),
});

/** About page copy (src/content/about/<locale>.yaml). */
const about = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/about' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    intro: z.object({ kicker: z.string(), title: z.string(), lead: z.string(), imageAlt: z.string() }),
    story: z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
    team: z.object({ title: z.string(), text: z.string(), values: z.array(textItem) }),
    company: z.object({
      title: z.string(),
      text: z.string(),
      facts: z.array(z.object({ label: z.string(), value: z.string() })),
    }),
    pros: z.object({ title: z.string(), text: z.string(), points: z.array(z.string()), button: z.string() }),
    download: z.object({ title: z.string(), text: z.string() }),
  }),
});

export const collections = { home, features, faq, about };
