import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

export function useFocusLoad(load: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    setError('')
    return load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [load])

  useFocusEffect(
    useCallback(() => {
      reload()
    }, [reload])
  )

  return { isLoading, error, setError, reload }
}
