export const uploadApi = {
  upload: async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach((f) => formData.append("files", f))

    const r = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    const json = await r.json()
    if (!r.ok) throw new Error(json.error ?? "Upload failed")
    return json.filenames
  },
}
