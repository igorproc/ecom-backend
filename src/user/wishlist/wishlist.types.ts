export type TWishlistProductId = {
  itemId: number,
  productId: number,
  variantId?: number | null,
}

export type TWishlistReassignCartsInput = {
  guestWishlistToken: string,
  userWishlistToken: string,
}

export type TWishlistAssignCartsInput = {
  guestWishlistToken: string,
  authToken: string,
}
