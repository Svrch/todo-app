export type TButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface IButtonProps {
  variant?: TButtonVariant
  disabled?: boolean
  loading?: boolean
}
