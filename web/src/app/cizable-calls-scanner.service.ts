import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CizableCallsScanner {

  constructor() { }

  getCizableCallsForSymbol(symbol: string, callExpDateMap: any, underlyingLast: number) {

    const calls = []

    const callExpirationKeys = Object.keys(callExpDateMap);

    Object.keys(callExpDateMap)
      .forEach(callExpirationKey => {

        const callCurrentExpirationObj = callExpDateMap[callExpirationKey]

        const callStrikeObjects = Object.keys(callCurrentExpirationObj)

        callStrikeObjects.reverse()
          .forEach((currentStrike, strikeIndex, _originalStrikeObjects) => {

            if (+currentStrike < underlyingLast) {

              const optionBidPrice = callExpDateMap[callExpirationKey][currentStrike][0].bid;
              const optionAskPrice = callExpDateMap[callExpirationKey][currentStrike][0].ask;
              const optionLastPrice = callExpDateMap[callExpirationKey][currentStrike][0].last;

              if (optionAskPrice > 0 && optionBidPrice > 0) {

                const optionMidPointPrice = (optionAskPrice + optionBidPrice) / 2
                // const strikeMinusUnderlyingLast = +currentStrike - underlyingLast;
                const intrinsic_profit_midpt = underlyingLast - optionMidPointPrice - +currentStrike ;
                const intrinsic_profit_ask = underlyingLast - optionAskPrice - +currentStrike;
                const intrinsic_profit_per_doller_midpt = intrinsic_profit_midpt / (underlyingLast - optionMidPointPrice * 100);
                const intrinsic_profit_per_doller_ask = intrinsic_profit_ask / (underlyingLast - optionAskPrice * 100);


                if (intrinsic_profit_midpt > 0) {


                  const currentCall = {
                    exp: callExpirationKey,
                    strike: +currentStrike,
                    symbol,
                    intrinsic_profit_midpt,
                    intrinsic_profit_per_doller_midpt,
                    // intrinsic_profit_ask,
                    // intrinsic_profit_per_doller_ask,
                    underlyingLast,
                    // optionBidPrice,
                    // optionAskPrice,
                    // optionLastPrice,
                    optionMidPointPrice,
                    // strikeMinusUnderlyingLast
                  }

                  calls.push(currentCall)
                }
              }

            }

          })

      })

    calls.sort((a, b) => {
      // return a.intrinsic_profit < b.intrinsic_profit ? 1 : -1;
      // return a.intrinsic_profit_ask < b.intrinsic_profit_ask ? 1 : -1;
      return a.intrinsic_profit_midpt < b.intrinsic_profit_midpt ? 1 : -1;
      return a.intrinsic_profit_per_doller_midpt < b.intrinsic_profit_per_doller_midpt ? 1 : -1;
    })

    return calls;

  }

}
