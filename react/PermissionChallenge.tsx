import React from 'react'
import type { ElementType } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { defineMessages } from 'react-intl'

import { useProfileData } from './hooks/useProfileData'
import { useOrgAssignment } from './hooks/useOrgAssignment'
import { usePermissionIds } from './hooks/usePermissionIds'
import { useUserPermissionNames } from './hooks/useUserPermissionNames'

interface Permission {
  name: string
}

export interface MDField {
  key: string
  value: string
}

export interface MDSearchData {
  documents?: MDSearchDocument[]
}

export interface MDSearchDocument {
  id: string
  fields?: MDField[]
}

interface Props {
  permissions: Permission[]
  AllowedContent?: ElementType
  DisallowedContent?: ElementType
}

function PermissionChallenge({
  permissions = [],
  AllowedContent,
  DisallowedContent,
}: Props) {
  const profileData = useProfileData()
  const orgAssignment = useOrgAssignment(profileData)
  const permissionIds = usePermissionIds(orgAssignment)
  const { userPermissionNames } = useUserPermissionNames(permissionIds)

  let hasPermission = false

  if (userPermissionNames) {
    hasPermission = permissions.some(permission =>
      userPermissionNames.includes(permission.name)
    )
  }

  if (hasPermission) {
    return AllowedContent ? (
      <AllowedContent />
    ) : (
      <ExtensionPoint id="allowed-content" />
    )
  }

  return DisallowedContent ? (
    <DisallowedContent />
  ) : (
    <ExtensionPoint id="disallowed-content" />
  )
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
