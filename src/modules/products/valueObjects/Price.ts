import { ValueObject } from '@shared/core/entities/ValueObject'

interface PriceProps {
  id: string
  amount: number
}

export class Price extends ValueObject<PriceProps> {
  static create(props: PriceProps) {
    return new Price(props)
  }

  get id() {
    return this.props.id
  }

  get amount() {
    return this.props.amount
  }
}
