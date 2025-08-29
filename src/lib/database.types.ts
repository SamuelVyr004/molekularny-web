export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      pathways: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url_active: string | null
          image_url_inactive: string | null
          is_public: boolean
          name: string
          pathway_type: Database["public"]["Enums"]["pathway_type_enum"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url_active?: string | null
          image_url_inactive?: string | null
          is_public?: boolean
          name: string
          pathway_type?: Database["public"]["Enums"]["pathway_type_enum"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url_active?: string | null
          image_url_inactive?: string | null
          is_public?: boolean
          name?: string
          pathway_type?: Database["public"]["Enums"]["pathway_type_enum"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_new_project: {
        Args: { project_name: string }
        Returns: Json
      }
    }
    Enums: {
      compartment_enum:
        | "extracellular_space"
        | "plasma_membrane"
        | "cytosol"
        | "nucleus"
        | "mitochondrion"
        | "endoplasmic_reticulum"
        | "golgi_apparatus"
        | "lysosome"
        | "peroxisome"
        | "endosome"
      component_type_enum:
        | "protein"
        | "protein_complex"
        | "gene"
        | "rna"
        | "simple_molecule"
        | "second_messenger"
        | "ion"
        | "drug"
        | "phenotype"
      modification_type_enum:
        | "phosphorylated"
        | "ubiquitinated"
        | "acetylated"
        | "methylated"
        | "glycosylated"
        | "sumoylated"
        | "palmitoylated"
        | "nitrosylated"
        | "gtp_bound"
        | "gdp_bound"
      pathway_type_enum: "signaling" | "biochemical"
      process_type_enum:
        | "phosphorylation"
        | "dephosphorylation"
        | "ubiquitination"
        | "deubiquitination"
        | "acetylation"
        | "deacetylase"
        | "methylation"
        | "demethylation"
        | "glycosylation"
        | "sumoylation"
        | "palmitoylation"
        | "nitrosylation"
        | "gtp_gdp_exchange"
        | "complex_assembly"
        | "complex_dissociation"
        | "translocation"
        | "gene_expression"
        | "gene_repression"
        | "degradation"
        | "catalysis"
        | "activation"
        | "inhibition"
        | "state_transition"
        | "unknown"
      protein_subtype_enum:
        | "receptor_tyrosine_kinase"
        | "receptor_gpcr"
        | "receptor_ion_channel"
        | "receptor_cytokine"
        | "receptor_nuclear"
        | "kinase_ser_thr"
        | "kinase_tyr"
        | "phosphatase"
        | "gtpase_small"
        | "gtpase_heterotrimeric"
        | "adaptor"
        | "scaffold"
        | "transcription_factor"
        | "ligand_peptide"
        | "ligand_small_molecule"
        | "ion_channel"
        | "enzyme"
        | "ubiquitin_ligase"
        | "deubiquitinase"
        | "acetyltransferase"
        | "deacetylase"
        | "methyltransferase"
        | "demethylase"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      compartment_enum: [
        "extracellular_space",
        "plasma_membrane",
        "cytosol",
        "nucleus",
        "mitochondrion",
        "endoplasmic_reticulum",
        "golgi_apparatus",
        "lysosome",
        "peroxisome",
        "endosome",
      ],
      component_type_enum: [
        "protein",
        "protein_complex",
        "gene",
        "rna",
        "simple_molecule",
        "second_messenger",
        "ion",
        "drug",
        "phenotype",
      ],
      modification_type_enum: [
        "phosphorylated",
        "ubiquitinated",
        "acetylated",
        "methylated",
        "glycosylated",
        "sumoylated",
        "palmitoylated",
        "nitrosylated",
        "gtp_bound",
        "gdp_bound",
      ],
      pathway_type_enum: ["signaling", "biochemical"],
      process_type_enum: [
        "phosphorylation",
        "dephosphorylation",
        "ubiquitination",
        "deubiquitination",
        "acetylation",
        "deacetylase",
        "methylation",
        "demethylation",
        "glycosylation",
        "sumoylation",
        "palmitoylation",
        "nitrosylation",
        "gtp_gdp_exchange",
        "complex_assembly",
        "complex_dissociation",
        "translocation",
        "gene_expression",
        "gene_repression",
        "degradation",
        "catalysis",
        "activation",
        "inhibition",
        "state_transition",
        "unknown",
      ],
      protein_subtype_enum: [
        "receptor_tyrosine_kinase",
        "receptor_gpcr",
        "receptor_ion_channel",
        "receptor_cytokine",
        "receptor_nuclear",
        "kinase_ser_thr",
        "kinase_tyr",
        "phosphatase",
        "gtpase_small",
        "gtpase_heterotrimeric",
        "adaptor",
        "scaffold",
        "transcription_factor",
        "ligand_peptide",
        "ligand_small_molecule",
        "ion_channel",
        "enzyme",
        "ubiquitin_ligase",
        "deubiquitinase",
        "acetyltransferase",
        "deacetylase",
        "methyltransferase",
        "demethylase",
        "other",
      ],
    },
  },
} as const
