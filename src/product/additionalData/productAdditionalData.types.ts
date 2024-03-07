type TAdditionalDataItem = {
  id: number,
  label: string,
  description: string,
}

export type TAdditionalData = {
  label: string,
  items: TAdditionalDataItem[],
}
