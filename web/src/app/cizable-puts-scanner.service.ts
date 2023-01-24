import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CizablePutsScanner {

  MIN_STRIKE_DISTANCE = 0.5;

  constructor() { }

  getCizablePutsForSymbol(symbol: string, putExpDateMap: any, underlyingLast: number) {

    // console.log('getting cizable puts for: ' + symbol + ', $' + underlyingLast.toString().trim())

    const puts = []

    const putExpirationKeys = Object.keys(putExpDateMap);

    Object.keys(putExpDateMap)
      .forEach(putExpirationKey => {

        const putCurrentExpirationObj = putExpDateMap[putExpirationKey]

        const putStrikeObjects = Object.keys(putCurrentExpirationObj)

        putStrikeObjects.reverse()
          .forEach((currentStrike, strikeIndex, _originalStrikeObjects) => {

            if (+currentStrike > underlyingLast) {

              const optionBidPrice = putExpDateMap[putExpirationKey][currentStrike][0].bid;
              const optionAskPrice = putExpDateMap[putExpirationKey][currentStrike][0].ask;
              const optionLastPrice = putExpDateMap[putExpirationKey][currentStrike][0].last;

              if (optionAskPrice > 0 && optionBidPrice > 0) {

                const optionMidPointPrice = (optionAskPrice + optionBidPrice) / 2
                const strikeMinusUnderlyingLast = +currentStrike - underlyingLast;
                const intrinsic_profit_midpt = +currentStrike - underlyingLast - optionMidPointPrice;
                const intrinsic_profit_ask = +currentStrike - underlyingLast - optionAskPrice;
                const intrinsic_profit_per_doller_midpt = intrinsic_profit_midpt / (optionMidPointPrice + underlyingLast * 100);
                const intrinsic_profit_per_doller_ask = intrinsic_profit_ask / (optionAskPrice + underlyingLast * 100);


                if (intrinsic_profit_midpt > 0) {


                  const currentPut = {
                    exp: putExpirationKey,
                    strike: +currentStrike,
                    symbol,
                    intrinsic_profit_midpt,
                    intrinsic_profit_per_doller_midpt,
                    // intrinsic_profit_ask,
                    // intrinsic_profit_per_doller_ask,
                    underlyingLast,
                    optionBidPrice,
                    optionAskPrice,
                    optionLastPrice,
                    optionMidPointPrice,
                    strikeMinusUnderlyingLast
                  }

                  puts.push(currentPut)
                }
              }

            }

          })

      })

    puts.sort((a, b) => {
      // return a.intrinsic_profit < b.intrinsic_profit ? 1 : -1;
      // return a.intrinsic_profit_midpt < b.intrinsic_profit_midpt ? 1 : -1;
      return a.intrinsic_profit_per_doller_midpt < b.intrinsic_profit_per_doller_midpt ? 1 : -1;
    })

    return puts;

  }

}
