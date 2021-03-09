import { useQuery } from 'react-apollo'

import documentQuery from '../graphql/documents.graphql'
import {
  BUSINESS_PERMISSION,
  BUSINESS_PERMISSION_FIELDS,
  BUSINESS_PERMISSION_SCHEMA,
} from '../utils/const'
import type { MDSearchData } from '../PermissionChallenge'
import type { UsePermissionIdsReturn } from './usePermissionIds'

export interface UseUserPermissionNames {
  userPermissionNames?: string[] | null
}

export function useUserPermissionNames({
  permissionIds,
}: UsePermissionIdsReturn): UseUserPermissionNames {
  const { data: permissionData } = useQuery<MDSearchData>(documentQuery, {
    skip: !(permissionIds?.length > 0),
    variables: {
      acronym: BUSINESS_PERMISSION,
      fields: BUSINESS_PERMISSION_FIELDS,
      schema: BUSINESS_PERMISSION_SCHEMA,
    },
  })

  if (!permissionData || !permissionData.documents) {
    return { userPermissionNames: null }
  }

  const userPermissionNames: string[] = permissionData.documents
    .filter(document => permissionIds.includes(document.id))
    .map(
      document =>
        document.fields?.find(field => field.key === 'name')?.value ?? ''
    )
    .filter(Boolean)

  return { userPermissionNames }
}
