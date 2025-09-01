// Súbor: src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Tieto premenné musia byť dostupné aj v build procese na Verceli
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Vytvoríme si klienta priamo tu, pretože tento kód beží na serveri
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // DÔLEŽITÉ: Nahraď za tvoju finálnu doménu
  const baseUrl = 'https://www.mbonlinetools.eu';

  // 1. Pridáme statické stránky
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date() },
    // Stránka /pathways ako taká už nebude hlavná, ale môžeme ju nechať ako prehľad
    { url: `${baseUrl}/pathways`, lastModified: new Date() },
  ];

  // 2. Dynamicky načítame všetky verejné dráhy z databázy
  const { data: pathways } = await supabase
    .from('pathways')
    .select('id, created_at')
    .eq('is_public', true);

  const dynamicRoutes = (pathways || []).map(pathway => ({
    url: `${baseUrl}/pathways/${pathway.id}`, // Používame peknú URL
    lastModified: new Date(pathway.created_at),
  }));

  return [...staticRoutes, ...dynamicRoutes];
}