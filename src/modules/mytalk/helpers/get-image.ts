function getAuth() {
  const raw = localStorage.getItem('app_token')
  if (!raw) return { token: '', user: '' }

  try {
    const decoded = atob(raw)
    const parsed = JSON.parse(decoded)
    return {
      token: parsed?.access_token ?? '',
      user: String(parsed?.user ?? ''),
    }
  } catch {
    return { token: '', user: '' }
  }
}

export async function getImageFromApi(url: string) {
  const { token, user } = getAuth()
  const endpoint = `${url}?${new URLSearchParams({ user })}`

  const response = await fetch(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  if (!response.ok) {
    throw new Error('Falha ao baixar arquivo')
  }

  return await response.arrayBuffer()
}
