# Trade Inference System

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Note : This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) which has now been deprecated, so there is an Uncaught TypeError 'Cannot convert undefined or null to object' in the console, but it should be safe to ignore it for now.

### Production build

To build the app for production, run:

```
docker compose up
```

Then open [http://localhost:80](http://localhost:80) to view it in the browser.

## Requirements

Create a react component using typescript app for the requirements mentioned in [the requirement specification](requirement.md).

For external datasource, we can use a csv file instead of an API call. In future, we should be able to replace the csv file with an API call to something like Binance.

Assume a csv file with the following data as an external source for the token information:

```
|----------|------------|-----------|-------------------------------|
|Token Name|Token Symbol|Token Price|Implied Volatility of the asset|
|----------|------------|-----------|-------------------------------|
|Apple     | AAPL       | 185       | 0.1                           |
|Google    | GOOGL      | 170       | 0.2                           |
|Facebook  | FB         | 475       | 0.3                           |
|Netflix   | NFLX       | 610       | 0.4                           |
|Nvidia    | NVDA       | 909       | 0.5                           |
|Bitcoin   | BTC        | 69000     | 0.6                           |
|Ethereum  | ETH        | 3000      | 0.7                           |
|----------|------------|-----------|-------------------------------|

```


## Explanation

### How do you recognise which token it is?

The token name can be inferred from the token symbol. The token symbol is unique and can be used to identify the token. If the token name is empty, we can use many heuristics to determine, to simplify it for this assignment, I have used one heuristic for spot and one for option. For spot, I simply select the token(s) that are closest to the given price. If there are multiple tokens within a short difference from the target price(100 price units for now), I will return multiple tokens. For options, I select the token(s) that are closest to the given strike price using black shoals formula using similar logic to spot otherwise.

### How do you check for consistency?

The consistency of the trade can be checked by comparing the trade details with the data from the external source. Right now I don't have any external source, so I just check the the trade is internally consistent or not. For example, max notional should be greater than min notional, strike price should be greater than 0, etc. These checks can be extended to include more sophisticated checks like the price of the token should be within a certain range, the implied volatility of the asset should be within a certain range, etc in the future. Currently these checks are implemented in YupValidationSchema in the validation.schema.ts file.

### How would you improve it?

Currently the system assumed that the token name is always correct, but if the name of the token is provided, but the symbol is not valid from our external source, we should use a fuzzy search along with other heuristics to identify the symbol.

In future, the trade details can be validated using a more sophisticated algorithm or a machine learning model. 
In future, the missing information can be inferred using a more sophisticated algorithm or a machine learning model.

### How would you scale your solution if instead we were checking 1 million+ trades per second?

Currently due to the limitation of the external library, when an option is submitted without a name, the system will try to infer the token name by checking all the tokens in the external source. This can be slow if the external source is large. We should use a different library or a custom logic to get the spot price of the token from option premium, strike price, etc. and use it to search for the right token.
Ideally when the external source is large, we should use a cloud-based distributed system to search for the token in a different worker service and store them in our cache. For our purpose, we can use a simple cache like Redis to store the token information at the end of the day since we don't need the data real time. We can also use a distributed system to validate the trade details and infer the missing information in parallel and use a message queue like Kafka to distribute the work to different workers and store the results in a database like MongoDB or a data lake at the end of the day which will be used to populate the cache later.

### Scope and limitations of your overall approach

Right now everything is local and runs on a static frontend with no option to store any data. We should ideally have a separate backend service to store the data and validate the trade details and infer the missing information. The external source should be contacted from the backend service instead of directly from the frontend code. Currently trade validation is done in the frontend which limits the sophistication of our validation, these should ideally be done in the backend too, we can still have some frontend validation for simpler things and do more sophisticated validation in the backend. The external source is a static csv file, in the future, we should use a real-time API like Binance to get the token information.