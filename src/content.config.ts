import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SUBJECTS } from './lib/contact';
import { routes, type RouteKey } from './i18n/config';

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
      reassurance: z.string(),
      tagline: z.string(),
      imageAlt: z.string(),
    }),
    pillars: z.array(textItem.extend({ icon: z.enum(['users', 'calendar', 'map', 'camera']) })).length(4),
    benefits: z.object({
      title: z.string(),
      intro: z.string(),
      items: z.array(textItem.extend({ image: z.enum(['programme', 'reimbursements', 'shopping', 'gallery']) })).length(4),
      link: z.string(),
    }),
    useCases: z.object({
      title: z.string(),
      items: z.array(textItem.extend({ image: z.enum(['voyages', 'evenements', 'associations', 'projets']) })).length(4),
    }),
    audiences: z.object({ title: z.string(), intro: z.string(), items: z.array(textItem).length(3), partners: z.string() }),
    howItWorks: z.object({
      title: z.string(),
      intro: z.string(),
      steps: z.array(z.object({ label: z.string(), title: z.string(), points: z.array(z.string()) })),
    }),
    quickQuestions: z.object({ title: z.string(), link: z.string() }),
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
      items: z.array(textItem.extend({ icon: z.enum(['checklist', 'offline', 'idea', 'devices']) })),
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
        // onHome: also shown in the home page's quick questions (same text, single source).
        // link: optional "read more" link to a site page under the answer (`to` = route key).
        items: z.array(
          z.object({
            q: z.string(),
            a: z.string(),
            onHome: z.boolean().optional(),
            link: z.object({ label: z.string(), to: z.enum(Object.keys(routes) as [RouteKey, ...RouteKey[]]) }).optional(),
          }),
        ),
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

/** Contact page copy (src/content/contact/<locale>.yaml). */
const contact = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/contact' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    intro: z.object({ title: z.string(), text: z.string() }),
    form: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      subject: z.string(),
      subjectOptions: z.array(z.object({ value: z.enum(SUBJECTS), label: z.string() })),
      message: z.string(),
      submit: z.string(),
      sending: z.string(),
      privacyBefore: z.string(),
      privacyLink: z.string(),
      success: z.object({ title: z.string(), text: z.string() }),
      errors: z.object({ validation: z.string(), captcha: z.string(), send: z.string() }),
      noscript: z.string(),
    }),
    aside: z.object({
      title: z.string(),
      items: z.array(z.object({ label: z.string(), email: z.string() })),
    }),
  }),
});

/**
 * Legal pages in Markdown: src/content/legal/<locale>/<legal|terms|privacy>.md (entry id "fr/terms").
 * `reviewed: false` shows a "draft" banner and sets noindex until a legal professional has validated it.
 */
const legal = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    reviewed: z.boolean(),
    toc: z.boolean().default(false),
  }),
});

/** Invitation landing page (src/content/join/<locale>.yaml). */
const join = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/join' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    kicker: z.string(),
    title: z.string(),
    lead: z.string(),
    steps: z.array(textItem.extend({ textNoLink: z.string().optional() })).length(3),
    openButton: z.string(),
    help: z.string(),
    helpLink: z.string(),
    discover: z.object({ title: z.string(), text: z.string(), link: z.string() }),
  }),
});

/**
 * Install page for visitors outside the store countries (src/content/install/<locale>.yaml).
 * Links live in src/i18n/config.ts (`altInstall`).
 */
const install = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/install' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    kicker: z.string(),
    title: z.string(),
    lead: z.string(),
    ios: z.object({
      title: z.string(),
      intro: z.string(),
      steps: z.array(textItem).length(3),
      testflightButton: z.string(),
      joinButton: z.string(),
      scan: z.string(),
      note: z.string(),
    }),
    android: z.object({
      title: z.string(),
      intro: z.string(),
      steps: z.array(textItem).length(3),
      button: z.string(),
      scan: z.string(),
      pending: z.object({ text: z.string(), link: z.string() }),
    }),
    inStores: z.object({ title: z.string(), text: z.string() }),
    help: z.string(),
    helpLink: z.string(),
  }),
});

export const collections = { home, features, faq, about, contact, legal, join, install };
