export interface Operation {
  label: string,
  value: 0 | 1,
}

export interface Business {
  bid: number,
  name: string,
  address: string,
  operations: Operation[],
  rating: number,
  numReviews: number,
  owned: boolean,
  eligibleToReview: boolean,
}