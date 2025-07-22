export interface Database {
  public: {
    Tables: {
      legislations: {
        Row: {
          id: string
          celex_number: string
          title: string
          publication_date: string | null
          document_type: string | null
          summary: string | null
          source_url: string | null
          full_markdown_content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          celex_number: string
          title: string
          publication_date?: string | null
          document_type?: string | null
          summary?: string | null
          source_url?: string | null
          full_markdown_content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          celex_number?: string
          title?: string
          publication_date?: string | null
          document_type?: string | null
          summary?: string | null
          source_url?: string | null
          full_markdown_content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          legislation_id: string
          article_number: number | null
          article_number_text: string
          title: string
          filename: string | null
          markdown_content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          legislation_id: string
          article_number?: number | null
          article_number_text: string
          title: string
          filename?: string | null
          markdown_content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          legislation_id?: string
          article_number?: number | null
          article_number_text?: string
          title?: string
          filename?: string | null
          markdown_content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      case_laws: {
        Row: {
          id: string
          celex_number: string
          case_id_text: string | null
          title: string
          court: string | null
          date_of_judgment: string | null
          parties: string | null
          summary_text: string | null
          html_content: string | null
          plaintext_content: string | null
          html_content_link: string | null
          plaintext_content_link: string | null
          source_url: string | null
          operative_parts_combined: string | null
          operative_parts_individual: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          celex_number: string
          case_id_text?: string | null
          title: string
          court?: string | null
          date_of_judgment?: string | null
          parties?: string | null
          summary_text?: string | null
          html_content?: string | null
          plaintext_content?: string | null
          html_content_link?: string | null
          plaintext_content_link?: string | null
          source_url?: string | null
          operative_parts_combined?: string | null
          operative_parts_individual?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          celex_number?: string
          case_id_text?: string | null
          title?: string
          court?: string | null
          date_of_judgment?: string | null
          parties?: string | null
          summary_text?: string | null
          html_content?: string | null
          plaintext_content?: string | null
          html_content_link?: string | null
          plaintext_content_link?: string | null
          source_url?: string | null
          operative_parts_combined?: string | null
          operative_parts_individual?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      operative_parts: {
        Row: {
          id: string
          case_law_id: string
          part_number: number
          verbatim_text: string | null
          simplified_text: string | null
          markdown_content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_law_id: string
          part_number: number
          verbatim_text?: string | null
          simplified_text?: string | null
          markdown_content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_law_id?: string
          part_number?: number
          verbatim_text?: string | null
          simplified_text?: string | null
          markdown_content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      operative_part_interprets_article: {
        Row: {
          id: string
          operative_part_id: string
          article_id: string
          created_at: string
        }
        Insert: {
          id?: string
          operative_part_id: string
          article_id: string
          created_at?: string
        }
        Update: {
          id?: string
          operative_part_id?: string
          article_id?: string
          created_at?: string
        }
      }
      case_law_interprets_article: {
        Row: {
          id: string
          case_law_id: string
          article_id: string
          created_at: string
        }
        Insert: {
          id?: string
          case_law_id: string
          article_id: string
          created_at?: string
        }
        Update: {
          id?: string
          case_law_id?: string
          article_id?: string
          created_at?: string
        }
      }
      document_chunks: {
        Row: {
          id: string
          case_law_id: string | null
          operative_part_id: string | null
          article_id: string | null
          chunk_text: string
          embedding: any | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_law_id?: string | null
          operative_part_id?: string | null
          article_id?: string | null
          chunk_text: string
          embedding?: any | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_law_id?: string | null
          operative_part_id?: string | null
          article_id?: string | null
          chunk_text?: string
          embedding?: any | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Legislation = Database['public']['Tables']['legislations']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type CaseLaw = Database['public']['Tables']['case_laws']['Row']
export type OperativePart = Database['public']['Tables']['operative_parts']['Row']
export type OperativePartInterpretsArticle = Database['public']['Tables']['operative_part_interprets_article']['Row']
export type CaseLawInterpretsArticle = Database['public']['Tables']['case_law_interprets_article']['Row']
export type DocumentChunk = Database['public']['Tables']['document_chunks']['Row']

// Properly typed API responses for joined data
export interface OperativePartInterpretationItem {
  operative_part: OperativePart
  article: Article
}

export interface CaseWithOperativeParts extends CaseLaw {
  operative_parts: OperativePart[]
}

export interface ArticleInterpretationItem {
  case_law: CaseLaw
  operative_part: OperativePart
}

// Extended types for UI components
export interface ArticleWithLegislation extends Article {
  legislation: Legislation
}

export interface CaseLawWithOperativeParts extends CaseLaw {
  operative_parts: OperativePart[]
}

export interface OperativePartWithArticles extends OperativePart {
  articles: Article[]
}

export interface CaseInfoCardData {
  case_law: CaseLaw
  operative_parts: OperativePart[]
  context: 'legislation' | 'article' | 'case_list'
}

// Case viewer specific types
export interface CaseViewerData extends CaseLaw {
  operative_parts: OperativePartWithArticles[]
  interpreted_articles: ArticleWithOperativeParts[]
}

export interface ArticleWithOperativeParts extends ArticleWithLegislation {
  operative_parts: {
    id: string
    part_number: number
    verbatim_text: string | null
    simplified_text: string | null
  }[]
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  href: string
}

// Report builder types
export interface ReportConfig {
  title: string
  description?: string
  legislations: string[]
  articles: string[]
  includeOperativeParts: boolean
  operativePartsMode: 'verbatim' | 'simplified'
  includeArticleText: boolean
  includeCaseSummaries: boolean
  format: 'html' | 'pdf'
  template: 'standard' | 'detailed' | 'summary'
}

export interface ReportData {
  config: ReportConfig
  content: {
    legislations: LegislationReportData[]
    generatedAt: string
    totalArticles: number
    totalCases: number
  }
}

export interface LegislationReportData extends Legislation {
  articles: ArticleReportData[]
}

export interface ArticleReportData extends Article {
  legislation: Legislation
  cases: CaseReportData[]
}

export interface CaseReportData extends CaseLaw {
  operative_parts: OperativePartReportData[]
}

export interface OperativePartReportData extends OperativePart {
  articles: Article[]
}