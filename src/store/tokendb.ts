import Papa, { ParseResult } from "papaparse"
import {DataToken,IFormValues}  from "./datatype";
import {VanillaOption} from "black-scholes-bonanza";


export var TokenCache: DataToken[] = [];

const riskFreeRate = 4.8;

const priceDifferenceDelta = 100;
const premiumDifferenceDelta = 100;


class TokenDatabase {
    private tokens: DataToken[] = [];

    constructor() {
        this.loadTokensFromCSV();
    }

    private loadTokensFromCSV(): void {
        if (TokenCache.length > 0) {
            this.tokens = TokenCache;
            return;
        }
        Papa.parse("/tokens.csv", {
            header: true,
            download: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            delimiter: ",",
            complete: (results: ParseResult<DataToken>) => {
                if (results.errors.length) {
                    console.error("Errors while parsing csv : ", results.errors);
                }
                this.tokens = results.data;
                TokenCache = results.data;
            },
          })
    }

    public getHeuristicTokens(formValues : IFormValues): DataToken[] {
        const heuristicTokens: DataToken[] = [];
        if (formValues.instrument === 'Spot') {
            if (formValues.price) {
                heuristicTokens.push(...this.findClosestSpotPrice(formValues.price));
            }
        }
        if (formValues.instrument === 'Option') {

            let priceMap = new Map<DataToken, number>();

            for (let token of this.tokens) {
                const date1 = formValues.expirationDate ? new Date(formValues.expirationDate).getTime() : 0;
                const date2 = new Date().getTime();
                const yearDifference = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24 * 365);


                const vol = token.impliedvol;
                const rate = riskFreeRate;
                const time = yearDifference; // time to expiry
                const strike = formValues.strikePrice ? formValues.strikePrice : 0; // strike price
                const isCall = formValues.type === "call"; // call or put option
                const spot = token.price; // current spot price
                const opt = new VanillaOption(vol, rate, time, strike, isCall);

                const estimatedPrice = opt.getPrice(spot);

                console.log(`Option price from model : ${estimatedPrice}`);

                priceMap.set(token, estimatedPrice);
            }

            if (formValues.premium) {
                heuristicTokens.push(...this.findClosestOptionPrice(formValues.premium, priceMap));
            }
        }
        // Add more heuristics here to find tokens based on form values
        return heuristicTokens;
    }

    public findClosestSpotPrice(targetPrice: number): DataToken[] {
        const closestTokens: DataToken[] = [];

        const tokenArray = this.tokens.map(token => token.price);
        const sortedTokens = this.tokens

        var index = findClosestIndex(tokenArray,targetPrice);
        var currentToken = sortedTokens[index];
        closestTokens.push(currentToken);

        if(index > 0) {
            var prevToken = sortedTokens[index - 1];
            if(Math.abs(prevToken.price - targetPrice) < priceDifferenceDelta) {
                closestTokens.push(prevToken);
            }
        }

        if(index < sortedTokens.length - 1) {
            var nextToken = sortedTokens[index + 1];
            if(Math.abs(nextToken.price - targetPrice) < priceDifferenceDelta) {
                closestTokens.push(nextToken);
            }
        }

        return closestTokens;
    }

    public findClosestOptionPrice(targetPrice: number, priceMap : Map<DataToken, number>): DataToken[] {
        const closestTokens: DataToken[] = [];

        const tokenArray = this.tokens.map(token => priceMap.get(token) || 0);
        const sortedTokens = this.tokens

        var index = findClosestIndex(tokenArray,targetPrice);
        var currentToken = sortedTokens[index];
        closestTokens.push(currentToken);

        if(index > 0) {
            var prevToken = sortedTokens[index - 1];
            var prevTokenPremium = priceMap.get(prevToken);
            if(prevTokenPremium && Math.abs(prevTokenPremium - targetPrice) < premiumDifferenceDelta) {
                closestTokens.push(prevToken);
            }
        }

        if(index < sortedTokens.length - 1) {
            var nextToken = sortedTokens[index + 1];
            var nextTokenPremium = priceMap.get(nextToken);
            if(nextTokenPremium && Math.abs(nextTokenPremium - targetPrice) < premiumDifferenceDelta) {
                closestTokens.push(nextToken);
            }
        }

        return closestTokens;
    }
    
}

// Returns index closest to target in arr[]
function findClosestIndex(arr: number[], target : number) : number
{
    let n = arr.length;
 
    // Corner cases
    if (target <= arr[0])
        return 0;
    if (target >= arr[n - 1])
        return n - 1;
 
    // Doing binary search 
    let i = 0, j = n, mid = 0;
    while (i < j) 
    {
        mid = Math.floor((i + j) / 2);

        let midPrice = arr[mid];
 
        if (midPrice === target)
            return mid;
 
        // If target is less than array 
        // element,then search in left 
        if (target < midPrice)
        {
            // If target is greater than previous
            // to mid, return closest of two
            if (mid > 0 && target > arr[mid - 1]) 
                return getClosest(arr[mid - 1], mid - 1, 
                                  arr[mid], mid, target);
               
            // Repeat for left half 
            j = mid;              
        } else { // If target is greater than mid
            if (mid < n - 1 && target < arr[mid + 1]) 
                return getClosest(arr[mid], mid, 
                                  arr[mid + 1], mid + 1,
                                  target);                
            i = mid + 1; // update i
        }
    }
 
    // Only single element left after search
    return mid;
}

// Method to compare which one is the more close
// We find the closest by taking the difference
//  between the target and both values. It assumes
// that val2 is greater than val1 and target lies
// between these two.
function getClosest(val1 : number, val1Position :number, val2: number, val2Position : number, target : number) : number
{
    if (target - val1 >= val2 - target) 
        return val1Position;        
    else
        return val2Position;        
}

export default TokenDatabase;
