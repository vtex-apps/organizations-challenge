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

interface PermissionSchema {
  permissions?: string[]
}

interface Field {
  key: string
  value: string
}

const PermissionChallenge: StorefrontFunctionComponent<PermissionSchema> = ({
  permissions = [],
}: Props) => {
  const { data: profileData } = useQuery(profileQuery, {
    variables: { customFields: PROFILE_FIELDS },
  })

  const email = profileData?.profile?.email ?? ''
  const customFields: Field[] = profileData.profile.customFields ?? []

  const organizationId =
    customFields.find(customField => customField.key === 'organizationId')
      ?.value ?? ''

  const { data: orgAssignmentData } = useQuery(documentQuery, {
    skip: email === '' || organizationId === '',
    variables: {
      acronym: ORG_ASSIGNMENT,
      schema: ORG_ASSIGNMENT_SCHEMA,
      fields: ORG_ASSIGNMENT_FIELDS,
      where: `(email=${email} AND businessOrganizationId=${organizationId})`,
    },
  })

  const orgAssignmentDocuments = orgAssignmentData?.documents ?? []
  const rolePermissionDataFields: Field[] =
    orgAssignmentDocuments.length !== 0
      ? orgAssignmentDocuments[orgAssignmentDocuments.length - 1]?.fields
      : []

  const roleId =
    rolePermissionDataFields.find(field => field.key === 'roleId')?.value ?? ''

  const { data: rolePermissionData } = useQuery(documentQuery, {
    skip:
      !rolePermissionDataFields ||
      rolePermissionDataFields.length === 0 ||
      Boolean(roleId),
    variables: {
      acronym: BUSINESS_ROLE,
      fields: BUSINESS_ROLE_FIELDS,
      where: `(id=${roleId})`,
      schema: BUSINESS_ROLE_SCHEMA,
    },
  })

  const rolePermissionDocuments = rolePermissionData?.documents ?? []
  const rolePermissionFields: Field[] =
    rolePermissionDocuments.length !== 0
      ? rolePermissionDocuments[rolePermissionDocuments.length - 1]?.fields
      : []

  const permissionIds: string[] = JSON.parse(
    rolePermissionFields.find(field => field.key === 'permissions')?.value ??
      '[]'
  )

  const { data: permissionData } = useQuery(documentQuery, {
    skip:
      !rolePermissionFields ||
      rolePermissionFields.length === 0 ||
      Boolean(roleId),
    variables: {
      acronym: BUSINESS_PERMISSION,
      fields: BUSINESS_PERMISSION_FIELDS,
      schema: BUSINESS_PERMISSION_SCHEMA,
    },
  })

  const permissionDocuments: MDSearchDocumentResult[] =
    permissionData?.documents ?? []

  const userPermissionNames = permissionDocuments
    .filter((document: MDSearchDocumentResult) =>
      permissionIds.includes(document.id)
    )
    .map(
      (document: MDSearchDocumentResult) =>
        document.fields?.find(field => field.key === 'name')?.value ?? ''
    )

  const hasPermission =
    permissions.filter((permission: Permission) =>
      userPermissionNames.includes(permission.name)
    ).length > 0

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
