import { NextRequest, NextResponse } from 'next/server'

// Validation schemas
export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface ValidationRule {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'uuid' | 'email' | 'url'
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  enum?: string[]
  custom?: (value: any) => boolean | string
  sanitize?: (value: any) => any
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  data?: any
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Common validation patterns
const PATTERNS = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b|[';]--|\|\||&&)/i,
  xss: /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i
}

// Common sanitization functions
const SANITIZERS = {
  string: (value: any): string => {
    if (typeof value !== 'string') return String(value || '')
    // Remove potential XSS patterns
    return value
      .replace(PATTERNS.xss, '')
      .replace(/[<>]/g, '')
      .trim()
  },
  number: (value: any): number => {
    const num = Number(value)
    return isNaN(num) ? 0 : num
  },
  uuid: (value: any): string => {
    const str = String(value || '').toLowerCase().trim()
    return PATTERNS.uuid.test(str) ? str : ''
  },
  email: (value: any): string => {
    const str = String(value || '').toLowerCase().trim()
    return PATTERNS.email.test(str) ? str : ''
  }
}

export function validateData(data: any, schema: ValidationSchema): ValidationResult {
  const errors: ValidationError[] = []
  const validatedData: any = {}

  for (const [field, rule] of Object.entries(schema)) {
    const value = data[field]

    // Check if required field is missing
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED'
      })
      continue
    }

    // Skip validation if field is not required and not provided
    if (!rule.required && (value === undefined || value === null)) {
      continue
    }

    // Sanitize value first
    let sanitizedValue = value
    if (rule.sanitize) {
      sanitizedValue = rule.sanitize(value)
    } else if (rule.type === 'string') {
      sanitizedValue = SANITIZERS.string(value)
    } else if (rule.type === 'number') {
      sanitizedValue = SANITIZERS.number(value)
    } else if (rule.type === 'uuid') {
      sanitizedValue = SANITIZERS.uuid(value)
    } else if (rule.type === 'email') {
      sanitizedValue = SANITIZERS.email(value)
    }

    // Type validation
    const typeError = validateType(sanitizedValue, rule.type)
    if (typeError) {
      errors.push({
        field,
        message: typeError,
        code: 'INVALID_TYPE'
      })
      continue
    }

    // Length/range validation
    if (rule.min !== undefined || rule.max !== undefined) {
      const lengthError = validateLength(sanitizedValue, rule.min, rule.max, rule.type)
      if (lengthError) {
        errors.push({
          field,
          message: lengthError,
          code: 'INVALID_LENGTH'
        })
        continue
      }
    }

    // Pattern validation
    if (rule.pattern && typeof sanitizedValue === 'string') {
      if (!rule.pattern.test(sanitizedValue)) {
        errors.push({
          field,
          message: `${field} format is invalid`,
          code: 'INVALID_FORMAT'
        })
        continue
      }
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(sanitizedValue)) {
      errors.push({
        field,
        message: `${field} must be one of: ${rule.enum.join(', ')}`,
        code: 'INVALID_ENUM'
      })
      continue
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(sanitizedValue)
      if (customResult !== true) {
        errors.push({
          field,
          message: typeof customResult === 'string' ? customResult : `${field} is invalid`,
          code: 'CUSTOM_VALIDATION'
        })
        continue
      }
    }

    // Security checks
    const securityError = checkSecurity(sanitizedValue, field)
    if (securityError) {
      errors.push(securityError)
      continue
    }

    validatedData[field] = sanitizedValue
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validatedData : undefined
  }
}

function validateType(value: any, type: string): string | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') return 'Must be a string'
      break
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) return 'Must be a valid number'
      break
    case 'boolean':
      if (typeof value !== 'boolean') return 'Must be a boolean'
      break
    case 'array':
      if (!Array.isArray(value)) return 'Must be an array'
      break
    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return 'Must be an object'
      }
      break
    case 'uuid':
      if (typeof value !== 'string' || !PATTERNS.uuid.test(value)) {
        return 'Must be a valid UUID'
      }
      break
    case 'email':
      if (typeof value !== 'string' || !PATTERNS.email.test(value)) {
        return 'Must be a valid email address'
      }
      break
    case 'url':
      if (typeof value !== 'string' || !PATTERNS.url.test(value)) {
        return 'Must be a valid URL'
      }
      break
  }
  return null
}

function validateLength(value: any, min?: number, max?: number, type?: string): string | null {
  let length: number

  if (type === 'string') {
    length = String(value).length
  } else if (type === 'array') {
    length = Array.isArray(value) ? value.length : 0
  } else if (type === 'number') {
    length = Number(value)
  } else {
    return null
  }

  if (min !== undefined && length < min) {
    if (type === 'string') return `Must be at least ${min} characters`
    if (type === 'array') return `Must have at least ${min} items`
    if (type === 'number') return `Must be at least ${min}`
    return `Must be at least ${min}`
  }

  if (max !== undefined && length > max) {
    if (type === 'string') return `Must be at most ${max} characters`
    if (type === 'array') return `Must have at most ${max} items`
    if (type === 'number') return `Must be at most ${max}`
    return `Must be at most ${max}`
  }

  return null
}

function checkSecurity(value: any, field: string): ValidationError | null {
  if (typeof value !== 'string') return null

  // Check for SQL injection patterns
  if (PATTERNS.sqlInjection.test(value)) {
    return {
      field,
      message: 'Input contains potentially dangerous characters',
      code: 'SECURITY_VIOLATION'
    }
  }

  // Check for XSS patterns (additional check beyond sanitization)
  if (PATTERNS.xss.test(value)) {
    return {
      field,
      message: 'Input contains potentially dangerous HTML/JavaScript',
      code: 'SECURITY_VIOLATION'
    }
  }

  return null
}

// Common validation schemas for API endpoints
export const commonSchemas = {
  // UUID parameter validation
  uuidParam: {
    id: {
      type: 'uuid' as const,
      required: true
    }
  },

  // Pagination parameters
  pagination: {
    limit: {
      type: 'number' as const,
      min: 1,
      max: 1000,
      sanitize: (value: any) => Math.min(Math.max(parseInt(value) || 10, 1), 1000)
    },
    offset: {
      type: 'number' as const,
      min: 0,
      sanitize: (value: any) => Math.max(parseInt(value) || 0, 0)
    },
    page: {
      type: 'number' as const,
      min: 1,
      sanitize: (value: any) => Math.max(parseInt(value) || 1, 1)
    }
  },

  // Search parameters
  search: {
    q: {
      type: 'string' as const,
      required: true,
      min: 1,
      max: 500,
      custom: (value: string) => {
        if (value.trim().length === 0) return 'Search query cannot be empty'
        return true
      }
    },
    type: {
      type: 'string' as const,
      enum: ['legislation', 'articles', 'cases', 'all']
    }
  },

  // Report generation
  reportGeneration: {
    title: {
      type: 'string' as const,
      required: true,
      min: 1,
      max: 200
    },
    articles: {
      type: 'array' as const,
      custom: (value: any[]) => {
        if (!Array.isArray(value)) return 'Articles must be an array'
        if (value.length === 0) return 'At least one article must be selected'
        if (value.length > 50) return 'Too many articles selected (max 50)'
        
        // Validate each UUID
        for (const id of value) {
          if (!PATTERNS.uuid.test(id)) {
            return 'All article IDs must be valid UUIDs'
          }
        }
        return true
      }
    },
    includeOperativeParts: {
      type: 'boolean' as const
    },
    includeCaseSummaries: {
      type: 'boolean' as const
    }
  }
}

// HOF to validate API requests
export function withValidation<T extends any[]>(
  schema: ValidationSchema,
  handler: (request: NextRequest, validatedData: any, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Parse request data
      let requestData: any = {}

      // Get query parameters
      const url = new URL(request.url)
      for (const [key, value] of url.searchParams) {
        requestData[key] = value
      }

      // Get URL parameters (from route params)
      if (args.length > 0 && typeof args[0] === 'object' && 'params' in args[0]) {
        const params = await (args[0] as any).params
        Object.assign(requestData, params)
      }

      // Get body data for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
          const body = await request.json()
          Object.assign(requestData, body)
        } catch (error) {
          // Body might not be JSON, ignore error
        }
      }

      // Validate the data
      const validation = validateData(requestData, schema)

      if (!validation.isValid) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.errors
          },
          { status: 400 }
        )
      }

      // Call original handler with validated data
      return await handler(request, validation.data, ...args)
    } catch (error) {
      console.error('Validation middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      )
    }
  }
}