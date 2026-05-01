/**
 * Typed fetch helper used by all api wrappers.
 * Throws an Error with the server's error message when response is not 2xx.
 */
export async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const r = await fetch(url, init)
  const text = await r.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    throw new Error("Invalid JSON response")
  }
  if (!r.ok) {
    const msg =
      json && typeof json === "object" && "error" in json
        ? String((json as { error: unknown }).error)
        : `HTTP ${r.status}`
    throw new Error(msg)
  }
  return json as T
}

export const jsonInit = (
  method: string,
  body: unknown
): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
})
