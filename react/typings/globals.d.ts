import type { ReactNode } from 'react'
import type { ApolloError } from 'apollo-client'

declare global {
  interface ChallengeProps {
    children: ReactNode[]
  }

  interface MDField {
    key: string
    value: string
  }

  interface MDSearchResult {
    loading: boolean
    error?: ApolloError
    data: MDSearchData
  }

  interface MDSearchData {
    documents: MDSearchDocumentResult[]
  }

  interface MDSearchDocumentResult {
    id: string
    fields: MDField[]
  }

  interface StorefrontFunctionComponent<P = Record<string, unknown>>
    extends FunctionComponent<P> {
    schema?: unknown
    getSchema?(props?: P): unknown
  }
}
