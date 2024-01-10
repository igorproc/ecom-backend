export type TWishlistProductId = {
  productId: number,
  variantId?: number | null,
}

export type TWishlistAssignCartsInput = {
  guestWishlistToken: string,
  authToken: string,
}
