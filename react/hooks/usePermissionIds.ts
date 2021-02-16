import { useQuery } from 'react-apollo'

import documentQuery from '../graphql/documents.graphql'
import {
  BUSINESS_ROLE,
  BUSINESS_ROLE_FIELDS,
  BUSINESS_ROLE_SCHEMA,
} from '../utils/const'
import type { MDSearchData } from '../PermissionChallenge'
import type { UseOrgAssisgnmentReturn } from './useOrgAssignment'

const ARRAY_AS_STRING = '[]'

export interface UsePermissionIdsReturn {
  permissionIds: string[]
}

export function usePermissionIds({
  roleId,
}: UseOrgAssisgnmentReturn): UsePermissionIdsReturn {
  const { data: rolePermissionData } = useQuery<MDSearchData>(documentQuery, {
    skip: !roleId,
    variables: {
      acronym: BUSINESS_ROLE,
      fields: BUSINESS_ROLE_FIELDS,
      where: `(id=${roleId})`,
      schema: BUSINESS_ROLE_SCHEMA,
    },
  })

  if (!rolePermissionData || !rolePermissionData.documents) {
    return { permissionIds: [] }
  }

  const lastDocumentIndex = rolePermissionData.documents.length - 1
  const rolePermissionFields =
    rolePermissionData.documents[lastDocumentIndex]?.fields

  const unparsedPermissionIds = rolePermissionFields?.find(
    field => field.key === 'permissions'
  )?.value

  const permissionIds: string[] = JSON.parse(
    unparsedPermissionIds ?? ARRAY_AS_STRING
  )

  return { permissionIds }
}
