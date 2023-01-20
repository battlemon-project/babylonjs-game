import { Field } from '@/models/storage/Settings'

export interface Settings {
  fields: Array<Field>,
  open: boolean
}
