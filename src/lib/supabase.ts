import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Database query helpers
export const queries = {
  // Legislation queries
  getLegislations: async () => {
    const { data, error } = await supabase
      .from('legislations')
      .select('*')
      .order('title')
    
    if (error) throw error
    return data
  },

  getLegislation: async (id: string) => {
    const { data, error } = await supabase
      .from('legislations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Article queries
  getArticlesByLegislation: async (legislationId: string) => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('legislation_id', legislationId)
      .order('article_number')
    
    if (error) throw error
    return data
  },

  getArticle: async (id: string) => {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        legislation:legislations(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Case law queries
  getCaseLaws: async () => {
    const { data, error } = await supabase
      .from('case_laws')
      .select('*')
      .order('date_of_judgment', { ascending: false })
    
    if (error) throw error
    return data
  },

  getCaseLaw: async (id: string) => {
    const { data, error } = await supabase
      .from('case_laws')
      .select(`
        *,
        operative_parts(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Cases interpreting specific legislation
  getCasesByLegislation: async (legislationId: string) => {
    const { data, error } = await supabase
      .from('case_law_interprets_article')
      .select(`
        case_law:case_laws(*),
        article:articles(*)
      `)
      .eq('articles.legislation_id', legislationId)
    
    if (error) throw error
    return data
  },

  // Cases interpreting specific article
  getCasesByArticle: async (articleId: string) => {
    const { data, error } = await supabase
      .from('operative_part_interprets_article')
      .select(`
        operative_part:operative_parts(*),
        case_law:case_laws(*)
      `)
      .eq('article_id', articleId)
    
    if (error) throw error
    return data
  },

  // Search functionality
  searchLegislations: async (query: string) => {
    const { data, error } = await supabase
      .from('legislations')
      .select('*')
      .textSearch('title', query)
      .limit(10)
    
    if (error) throw error
    return data
  },

  searchCaseLaws: async (query: string) => {
    const { data, error } = await supabase
      .from('case_laws')
      .select('*')
      .textSearch('title', query)
      .limit(10)
    
    if (error) throw error
    return data
  }
}