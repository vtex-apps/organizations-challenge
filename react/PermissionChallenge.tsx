import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import documentQuery from './graphql/documents.graphql'
import profileQuery from './graphql/getProfile.graphql'
import { find, intersection, isEmpty, last, pathOr, prop, propEq } from 'ramda'

interface Props {
  permissions: Permission[]
}

interface Permission {
  name: string
}

interface PermissionSchema {
  permissions?: string[]
}

const PermissionChallenge: StorefrontFunctionComponent<PermissionSchema> = ({
  permissions = [],
}: Props) => {

  const { data: profileData } = useQuery(profileQuery, { variables: { customFields: "organizationId" } })
  const email = pathOr('', ['profile', 'email'], profileData)
  const organizationId = pathOr(
    '',
    ['value'],
    find(propEq('key', 'organizationId'))(
      pathOr([], ['profile', 'customFields'], profileData)
    )
  ) as any

  const {
    data: orgAssignmentData,
  } = useQuery(documentQuery, {
    skip: email === '' || organizationId === '',
    variables: {
      acronym: 'UserOrgAssignment',
      schema: 'organization-assignment-schema-v2',
      fields: ['roleId'],
      where:
        `(email=${email} AND businessOrganizationId=${organizationId})`,
    },
  })

  const fields: MDField[] = prop(
    'fields',
    last((orgAssignmentData ? orgAssignmentData.documents : []) as any[])
  )

  const roleId: string = pathOr(
    '',
    ['value'],
    find(propEq('key', 'roleId'), fields || { key: '', value: '' })
  )

  const { data: rolePermissionData } = useQuery(documentQuery, {
    skip: !fields || isEmpty(roleId),
    variables: {
      acronym: 'BusinessRole',
      fields: ['permissions'],
      where: `(id=${roleId})`,
      schema: 'business-role-schema-v1',
    },
  })

  const rolePermissionFields: MDField[] = prop(
    'fields',
    last((rolePermissionData ? rolePermissionData.documents : []) as any[])
  )

  const permissionIds: string[] = JSON.parse(
    pathOr(
      '[]',
      ['value'],
      find(
        propEq('key', 'permissions'),
        rolePermissionFields || { key: '', value: '' }
      )
    )
  )

  const { data: permissionData } = useQuery(documentQuery, {
    skip: !rolePermissionFields || isEmpty(roleId),
    variables: {
      acronym: 'BusinessPermission',
      fields: ['id', 'name'],
      schema: 'business-permission-schema-v1',
    },
  })

  const permissionDocuments: MDSearchDocumentResult[] = permissionData
    ? permissionData.documents
    : []

  const userPermissionNames = permissionDocuments
    .filter((document: MDSearchDocumentResult) =>
      permissionIds.includes(document.id)
    )
    .map((document: MDSearchDocumentResult) =>
      pathOr(
        '',
        ['value'],
        find(propEq('key', 'name'), document.fields || { key: '', value: '' })
      )
    )
  const hasPermission =
    intersection(
      permissions.map((permission: Permission) => permission.name),
      userPermissionNames
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
