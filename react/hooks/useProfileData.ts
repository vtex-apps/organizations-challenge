import { useQuery } from 'react-apollo'

import profileQuery from '../graphql/getProfile.graphql'
import { PROFILE_FIELDS } from '../utils/const'
import type { MDField } from '../PermissionChallenge'

interface ProfileData {
  profile?: {
    email?: string
    customFields?: MDField[]
  }
}

export interface UseProfileDataReturn {
  email?: string
  organizationId?: string
}

export function useProfileData(): UseProfileDataReturn {
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
