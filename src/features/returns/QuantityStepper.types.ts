export type QuantityStepperProps = {
  qty: number
  max: number
  onChange: (qty: number) => void
  disabled?: boolean
}
