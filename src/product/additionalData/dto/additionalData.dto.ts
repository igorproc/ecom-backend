// Node Deps
import { IsString, IsNumber } from 'class-validator'

export class createAdditionalDataGroupInput {
  @IsNumber()
  productId: number

  @IsString()
  label: string
}

export class createAdditionalDataItemInput {
  @IsNumber()
  groupId: number

  @IsString()
  label: string

  @IsString()
  value: string
}
