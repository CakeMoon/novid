export interface Business {
  bid: number,
  name: string,
  address: string,
  delivery: 0 | 1,
  takeout: 0 | 1,
  outdoor: 0 | 1,
  indoor: 0 | 1,
  vcode: number,
  authcode: number,
  rating?: number,
  numReviews: number,
}