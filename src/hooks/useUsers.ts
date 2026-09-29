import { useCallback, useEffect, useState } from 'react'
import { fetchUsers } from '../api/users.ts'
import type { DirectoryUser } from '../types.ts'

type RequestStatus = 'loading' | 'success' | 'error'

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while loading users.'
}

export function useUsers() {
  const [users, setUsers] = useState<DirectoryUser[]>([])
  const [status, setStatus] = useState<RequestStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function load() {
      try {
        const nextUsers = await fetchUsers(controller.signal)

        if (!active) {
          return
        }

        setUsers(nextUsers)
        setErrorMessage(null)
        setStatus('success')
      } catch (error) {
        if (!active) {
          return
        }

        setStatus('error')
        setErrorMessage(toErrorMessage(error))
      }
    }

    void load()

    return () => {
      active = false
      controller.abort()
    }
  }, [requestId])

  const retry = useCallback(() => {
    setStatus('loading')
    setErrorMessage(null)
    setRequestId((current) => current + 1)
  }, [])

  return { users, status, errorMessage, retry }
}
