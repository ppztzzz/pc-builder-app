import type { ComponentResponse, ComponentType } from "./component"

export type BuildSlotEntry = {
  slot: ComponentType
  componentId: number
}

export type BuildResponse = {
  id: string
  components: BuildSlotEntry[]
  totalPrice: number
  fpsResult: {
    valorant: number
    gta5: number
    cyberpunk: number
  } | null
  createdAt: string
}

export type CreateBuildRequest = {
  components: BuildSlotEntry[]
  totalPrice: number
  fpsResult: {
    valorant: number
    gta5: number
    cyberpunk: number
  } | null
}

// Returned alongside BuildResponse with hydrated components, used by the share page
export type HydratedBuild = BuildResponse & {
  hydrated: Partial<Record<ComponentType, ComponentResponse>>
}
