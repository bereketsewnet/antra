export type QuestionType =
  | 'short_text' | 'paragraph' | 'multiple_choice' | 'checkboxes'
  | 'dropdown' | 'linear_scale' | 'rating' | 'date' | 'email' | 'number'

export interface QuestionConfig {
  options?: string[]
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}

export interface SurveyQuestion {
  id?: number
  type: QuestionType
  title: string
  help_text?: string | null
  is_required: boolean
  config: QuestionConfig
}

export interface SurveySettings {
  collect_email: boolean
  show_progress: boolean
  confirmation_message: string
  response_limit: number | null
}

export interface SurveyListItem {
  id: number
  slug: string
  title: string
  status: 'draft' | 'published' | 'closed'
  created_at: string
  response_count: number
  question_count: number
}

export interface SurveyFull {
  id: number
  slug: string
  title: string
  description: string | null
  status: 'draft' | 'published' | 'closed'
  settings: SurveySettings
  response_count: number
}

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Short answer' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'multiple_choice', label: 'Multiple choice (pick one)' },
  { value: 'checkboxes', label: 'Checkboxes (pick many)' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'linear_scale', label: 'Linear scale' },
  { value: 'rating', label: 'Star rating' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
]

export const CHOICE_TYPES: QuestionType[] = ['multiple_choice', 'checkboxes', 'dropdown']

export function defaultConfig(type: QuestionType): QuestionConfig {
  if (CHOICE_TYPES.includes(type)) return { options: ['Option 1'] }
  if (type === 'linear_scale') return { min: 1, max: 5, minLabel: '', maxLabel: '' }
  if (type === 'rating') return { max: 5 }
  return {}
}

export const DEFAULT_SETTINGS: SurveySettings = {
  collect_email: false,
  show_progress: true,
  confirmation_message: 'Thank you — your response has been recorded.',
  response_limit: null,
}
