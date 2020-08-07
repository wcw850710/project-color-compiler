export interface iResolve {
  status: number,
  message: string
}

export interface iReturnResponse extends iResolve {
  data: any
}