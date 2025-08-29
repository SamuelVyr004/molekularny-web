-- Vytvorenie nových ENUM typov
CREATE TYPE public.compartment_enum AS ENUM (
    'membrane', 'cytosol', 'nucleus', 'mitochondria', 'er', 'golgi', 'lysosome', 'extracellular', 'peroxisome'
);

CREATE TYPE public.entity_state_enum AS ENUM (
    'active', 'inactive'
);

-- Rozšírenie tabuľky 'entities'
ALTER TABLE public.entities
ADD COLUMN subtype TEXT,
ADD COLUMN compartment public.compartment_enum NOT NULL DEFAULT 'cytosol',
ADD COLUMN state public.entity_state_enum NOT NULL DEFAULT 'inactive',
ADD COLUMN metadata JSONB,
-- Pole textových reťazcov pre jednoduché modifikácie, napr. ["phospho:Y1068", "ubiquitin:K48"]
ADD COLUMN post_translational_mods TEXT[];

-- Rozšírenie tabuľky 'interactions'
ALTER TABLE public.interactions
ADD COLUMN site TEXT, -- napr. Y1068
ADD COLUMN kinetics JSONB,
ADD COLUMN reversible BOOLEAN NOT NULL DEFAULT false;

-- Vytvorenie tabuľky pre verzie
CREATE TABLE public.versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot JSONB, -- Kompletný stav projektu v tomto momente
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_project_version UNIQUE (project_id, version_number)
);
-- Index pre rýchlejšie vyhľadávanie verzií
CREATE INDEX ON public.versions (project_id);

-- Pridanie RLS (Row Level Security) na tabuľky
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.versions ENABLE ROW LEVEL SECURITY;

-- Politiky pre 'projects'
CREATE POLICY "Allow authenticated users to create projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow project members to view projects" ON public.projects FOR SELECT USING (id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Allow project owner to update project" ON public.projects FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Allow project owner to delete project" ON public.projects FOR DELETE USING (owner_id = auth.uid());

-- Politiky pre 'project_members' (príklad, môže byť zložitejšie)
CREATE POLICY "Allow members to see themselves" ON public.project_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Allow owner to manage members" ON public.project_members FOR ALL USING (
    (SELECT owner_id FROM public.projects WHERE id = project_id) = auth.uid()
);

-- Politiky pre 'entities' a 'interactions'
CREATE POLICY "Allow members to view pathway data" ON public.entities FOR SELECT USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Allow editors and owners to modify pathway data" ON public.entities FOR ALL USING (
    project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND (role = 'editor' OR role = 'owner'))
);

CREATE POLICY "Allow members to view pathway data" ON public.interactions FOR SELECT USING (project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid()));
CREATE POLICY "Allow editors and owners to modify pathway data" ON public.interactions FOR ALL USING (
    project_id IN (SELECT project_id FROM public.project_members WHERE user_id = auth.uid() AND (role = 'editor' OR role = 'owner'))
);

```Spustite migráciu cez Supabase CLI: `npx supabase db push`.

#### Krok 1.2: Aktualizácia typov
Po úspešnej migrácii si vygenerujte nové typy:
`npx supabase gen types typescript --project-id <vas-projekt-id> > lib/database.types.ts`

#### Krok 1.3: Refaktoring `InspectorPanel.tsx`
Tento komponent dostane najväčší upgrade. Nahraďte jeho obsah týmto kódom. Umožní editovať nové polia.

```typescript
// components/InspectorPanel.tsx
'use client';

import { useState, useEffect, useMemo } from "react";
// ... ostatné importy ...
import { Textarea } from "@/components/ui/textarea"; // Nový import

// ... typy zostávajú rovnaké ...

export function InspectorPanel({ selectedElement, onUpdate, onDelete }: { /* ... props ... */ }) {
  // ... hooky zostávajú rovnaké ...
  const [formData, setFormData] = useState<Partial<Entity> & Partial<Interaction>>({});

  const isNode = useMemo(() => selectedElement?.group === 'nodes', [selectedElement]);

  useEffect(() => {
    setFormData(selectedElement ? selectedElement.data : {});
  }, [selectedElement]);

  const handleInputChange = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleSaveChanges = async () => {
    if (!selectedElement) return;
    setIsLoading(true);
    const elementId = selectedElement.data.id;
    const tableName = isNode ? 'entities' : 'interactions';

    // Pripravíme dáta na update - berieme len to, čo sa môže meniť
    const dataToUpdate = isNode
      ? { label: formData.label, type: formData.type, compartment: formData.compartment, post_translational_mods: formData.post_translational_mods }
      : { interaction: formData.interaction, site: formData.site, reversible: formData.reversible };

    const { error } = await supabase.from(tableName).update(dataToUpdate).eq('id', elementId);
    setIsLoading(false);

    if (error) {
      toast({ title: "Error", description: `Could not save changes: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Element updated." });
      onUpdate(elementId, dataToUpdate, selectedElement.group);
    }
  };

  const handleDelete = () => { /* ... zostáva rovnaké ... */ };

  if (!selectedElement) { /* ... zostáva rovnaké ... */ }

  return (
    <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border h-full text-text flex flex-col gap-6 overflow-y-auto">
      <h3 className="text-xl font-bold text-heading font-primary">{isNode ? "Node Properties" : "Interaction Properties"}</h3>
      
      {isNode && (
        <div className="space-y-4">
          {/* Label a Type zostávajú rovnaké */}
          <div className="space-y-2">
            <Label htmlFor="compartment">Compartment</Label>
            <Select value={formData.compartment || 'cytosol'} onValueChange={(value) => handleInputChange('compartment', value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cytosol">Cytosol</SelectItem>
                <SelectItem value="membrane">Membrane</SelectItem>
                <SelectItem value="nucleus">Nucleus</SelectItem>
                {/* Doplňte ostatné enum hodnoty */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ptms">Post-Translational Mods</Label>
            <Textarea 
              id="ptms"
              placeholder="e.g., phospho:Y1068,ubiquitin:K48"
              value={(formData.post_translational_mods || []).join(',')}
              onChange={(e) => handleInputChange('post_translational_mods', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-muted-foreground">Comma-separated values.</p>
          </div>
        </div>
      )}

      {!isNode && (
        <div className="space-y-4">
          {/* Interaction Type zostáva rovnaké */}
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Input id="site" placeholder="e.g., Y1068" value={formData.site || ''} onChange={(e) => handleInputChange('site', e.target.value)} />
          </div>
        </div>
      )}
      {/* Save a Delete tlačidlá zostávajú rovnaké */}
    </div>
  );
}