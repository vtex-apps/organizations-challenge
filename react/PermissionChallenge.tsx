import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'

import documentQuery from './graphql/documents.graphql'
import profileQuery from './graphql/getProfile.graphql'
import {
  PROFILE_FIELDS,
  ORG_ASSIGNMENT,
  ORG_ASSIGNMENT_FIELDS,
  ORG_ASSIGNMENT_SCHEMA,
  BUSINESS_ROLE,
  BUSINESS_ROLE_FIELDS,
  BUSINESS_ROLE_SCHEMA,
  BUSINESS_PERMISSION,
  BUSINESS_PERMISSION_FIELDS,
  BUSINESS_PERMISSION_SCHEMA,
} from './utils/const'

interface Props {
  permissions: Permission[]
}

interface Permission {
  name: string
}

interface MDField {
  key: string
  value: string
}

interface ProfileData {
  profile?: {
    email?: string
    customFields?: MDField[]
  }
}

interface MDSearchData {
  documents?: MDSearchDocument[]
}

interface MDSearchDocument {
  id: string
  fields?: MDField[]
}

interface UseProfileDataReturn {
  email?: string
  organizationId?: string
}

function useProfileData(): UseProfileDataReturn {
  const { data: profileData } = useQuery<ProfileData>(profileQuery, {
    variables: { customFields: PROFILE_FIELDS },
  })

  const email = profileData?.profile?.email
  const customFields = profileData?.profile?.customFields

  const organizationId = customFields?.find(
    customField => customField.key === 'organizationId'
  )?.value

  return { email, organizationId }
}

interface UseOrgAssisgnmentReturn {
  roleId?: string | null
}

function useOrgAssignment({
  email,
  organizationId,
}: UseProfileDataReturn): UseOrgAssisgnmentReturn {
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

interface UsePermissionIdsReturn {
  permissionIds: string[]
}

const ARRAY_AS_STRING = '[]'

function usePermissionIds({
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

interface UseUserPermissionNames {
  userPermissionNames?: string[] | null
}

function useUserPermissionNames({
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

function PermissionChallenge({ permissions = [] }: Props) {
  const profileData = useProfileData()
  const orgAssignment = useOrgAssignment(profileData)
  const permissionIds = usePermissionIds(orgAssignment)
  const { userPermissionNames } = useUserPermissionNames(permissionIds)

  let hasPermission = false

  if (userPermissionNames) {
    hasPermission =
      permissions.filter(permission =>
        userPermissionNames.includes(permission.name)
      ).length > 0
  }

  if (hasPermission) {
    return <ExtensionPoint id="allowed-content" />
  }

  return <ExtensionPoint id="disallowed-content" />
}

const messages = defineMessages({
  permissionChallengeTitle: {
    defaultMessage: '',
    id: 'admin/editor.challenge-permission.title',
  },
})

PermissionChallenge.schema = {
  // tslint:disable: object-literal-sort-keys
  title: messages.permissionChallengeTitle.id,
  type: 'object',
  properties: {
    permissions: {
      minItems: 0,
      type: 'array',
      title: 'admin/editor.challenge-permission.permissions.title',
      items: {
        title: 'admin/editor.challenge-permission.permissions.items.title',
        type: 'object',
        properties: {
          name: {
            title: 'admin/editor.challenge-permission.permissions.items.name',
            type: 'string',
          },
        },
      },
    },
  },
}

export default PermissionChallenge
