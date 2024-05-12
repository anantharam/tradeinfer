
export type DataToken = {
    id: number;
    name: string;
    symbol: string;
    price: number;
    impliedvol: number;
}

export interface IFormValues {
    instrument: string;
    minNotional: number;
    maxNotional: number;
    expirationDate?: Date;
    type?: string;
    premium?: number;
    strikePrice?: number;
    quantity?: number;
    price?: number;
    tokenName: string;
  }
