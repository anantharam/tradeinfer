# Trader Inference Form

## **Overview**

This problem concerns an over the counter (OTC) trader working in digital assets. This trader manually books trades, these may be spot or options. However, this trader makes mistakes and our job is to help him by inferring missing fields or flagging potential inconsistencies or mistakes in the trade.

This will involve:

- Building a user interface, and
- inferring missing data and/or validating data submitted by the user using (i) form validation (ii) external data sources (iii) an understanding of the underlying finance to spot problems or inconsistencies.

**Both of these areas are very important, and are critical to the exercise.** 

**Note: If you’re not too familiar with finance or want a quick refresher on some of the terms used here please scroll to the bottom for some links that may help.**

## **Problem Statement**

A user interface must be written in Typescript. The interface must take the following inputs:

- **Instrument**, which is a dropdown and can either be set to Option or Spot; and
- **Min. Notional** and **Max. Notional,** both of which take numbers.

If **Instrument** is set to Option, a form with the following fields must be made visible: Expiration date, type (put or call), premium, strike price, quantity (**note**: assume each contract controls a single token), and token name.

If **Instrument** is set to Spot, a form with the following fields must be made visible: Price, quantity, and token name.

There should be a single button labelled “Submit”. The form should fail validation in the event that any piece of data is missing, with the exception of “token name” which may be left blank.

Assuming form validation passes, pressing the button should produce the following results:

- If the notional limits are exceeded the trade should also fail.
- If the “token name” field has been left blank, attempt to infer the token from the trade details (including the min/max notional limits and those details specific to the instrument) and/or using any other external source that may be valuable (e.g. an online source such as Binance). Provide feedback to the user on what token was inferred (and feel free to provide multiple options if need be).
- Check that any trade is consistent. That means ensuring the price and all other details roughly matches what we know from other sources. For example, does the price in a Spot trade roughly match results from Binance and other sources or, in the event of an options trade, does the overall trade make sense in light of mathematical models used to price options (e.g. **Black–Scholes**). Please be as sophisticated as you can as you try and check consistency of a trade.

Please note that **ANY TOKEN USED FOR BINANCE SPOT** **TRADING could be referenced in these trades (either Spot or Options)**. This means any token from this list could be referenced:  https://www.binance.com/en-GB/markets/overview).

- **Note**: there are no options listed for most tokens on this list, so it may be useful to research how options are priced (e.g. **Black–Scholes**) and derive prices and other specifics from underlying spot data.

**Data Sources**

- You may want to use the Binance API (or similar) in order to get price information on tokens. You can find the details on the API here: https://binance-docs.github.io/apidocs/futures/en/#change-log.

## **What to Focus on**

In this exercise **we’re especially interested** in your solution and your thought process as you infer missing information (token) and determine if errors are present. Your thought process should be clear in your code and well-explained in your readme. Please remember this is both a validation/inference problem **AND** a UI/UX problem, nether should be a placeholder for the other.

## **Finally**

In the readme please include…

- Detailed instructions to run your project from scratch.
- A detailed explanation of your solution to the problem.
    - How do you recognise which token it is?
    - How do you check for consistency?
    - How would you improve it?
- A brief explanation of how you would scale your solution if instead we were checking 1 million+ trades per second.
- A brief explanation of the scope and limitations of your overall approach.

## Additional Help

If you’re not too familiar with finance, here we some links which may be helpful. 

What is an Option and how do they work?

- [https://en.wikipedia.org/wiki/Option_(finance)](https://en.wikipedia.org/wiki/Option_(finance))
- https://www.youtube.com/watch?v=VJgHkAqohbU (here is a great intro)

What is a spot trade?

- https://www.investopedia.com/terms/s/spottrade.asp
- https://www.coinbase.com/en-gb/learn/crypto-basics/what-is-spot-trading-in-crypto-and-how-does-it-work (here is a crypto specific discussion)

You referenced an OTC trader, what’s that?

- https://www.investopedia.com/terms/o/over-the-countermarket.asp