import { useQuery } from 'react-apollo'

import documentQuery from '../graphql/documents.graphql'
import {
  ORG_ASSIGNMENT_FIELDS,
  ORG_ASSIGNMENT_SCHEMA,
  ORG_ASSIGNMENT,
} from '../utils/const'
import type { MDSearchData } from '../PermissionChallenge'
import type { UseProfileDataReturn } from './useProfileData'

export interface UseOrgAssignmentReturn {
  roleId?: string | null
}

export function useOrgAssignment({
  email,
  organizationId,
}: UseProfileDataReturn): UseOrgAssignmentReturn {
  const { data: orgAssignmentData } = useQuery<MDSearchData>(documentQuery, {
    skip: !email || !organizationId,
    variables: {
      acronym: ORG_ASSIGNMENT,
      schema: ORG_ASSIGNMENT_SCHEMA,
      fields: ORG_ASSIGNMENT_FIELDS,
      where: `(email=${email} AND businessOrganizationId=${organizationId})`,
    },
  })

  if (!orgAssignmentData || !orgAssignmentData.documents) {
    return { roleId: null }
  }

  const lastDocumentIndex = orgAssignmentData?.documents?.length - 1
  const rolePermissionFields =
    orgAssignmentData.documents[lastDocumentIndex]?.fields

  const roleId = rolePermissionFields?.find(field => field.key === 'roleId')
    ?.value

  return { roleId }
}
