import { ValueObject } from '@shared/core/entities/ValueObject'

interface CustomerProps {
  id: string
  name: string
  email: string
  userId: string
}

export class Customer extends ValueObject<CustomerProps> {
  static create(props: CustomerProps) {
    return new Customer(props)
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get userId() {
    return this.props.userId
  }
}
