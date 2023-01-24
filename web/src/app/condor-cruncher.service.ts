import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CondorCruncher {

  MIN_STRIKE_DISTANCE = 0.5;

  constructor() { }

  getCizablePutsForSymbol(symbol: string, putExpDateMap: any, underlyingLast: number) {

    console.log('getting cizable puts for: ', symbol, ': $', underlyingLast)

  }
    
  getCondors_oldLogic(symbol: string, callExpDateMap: any, putExpDateMap: any, underlyingLast: number) {

    console.log('crunching...', symbol);

    const gudOnes = [];

    const callSpreads = []
    const putSpreads = []

    const callExpirationKeys = Object.keys(callExpDateMap);
    const putExpirationKeys = Object.keys(putExpDateMap);

    console.log('callEx', callExpirationKeys);
    console.log('putEx', putExpirationKeys);

    Object.keys(callExpDateMap)
      .forEach(callExpirationKey => {

        const callCurrentExpirationObj = callExpDateMap[callExpirationKey]

        console.log('current expiration: ', callExpirationKey)

        console.log({ callCurrentExpirationObj })

        console.log({ underlyingLast })

        const callStrikeObjects = Object.keys(callCurrentExpirationObj)

        console.log({ callStrikeObjects })

        callStrikeObjects
          .forEach((currentStrike, strikeIndex, _originalStrikeObjects) => {

            console.log({ strikeIndex })

            if (+currentStrike > underlyingLast && strikeIndex < _originalStrikeObjects.length - 2) {

              const nextStrike = _originalStrikeObjects[+strikeIndex + 1]
              const oneGapperStrike = _originalStrikeObjects[+strikeIndex + 2]

              console.log('currentStrike: ', currentStrike)
              console.log('underlyingLast: ', underlyingLast)
              console.log({ nextStrike })
              console.log({ oneGapperStrike })

              const currentStrikeBid = callExpDateMap[callExpirationKey][currentStrike][0].bid;
              const currentStrikeAsk = callExpDateMap[callExpirationKey][currentStrike][0].ask;
              const nextStrikeBid = callExpDateMap[callExpirationKey][nextStrike][0].bid;
              const nextStrikeAsk = callExpDateMap[callExpirationKey][nextStrike][0].ask;
              const oneGapperStrikeBid = callExpDateMap[callExpirationKey][oneGapperStrike][0].bid;
              const oneGapperStrikeAsk = callExpDateMap[callExpirationKey][oneGapperStrike][0].ask;

              console.log({ currentStrikeBid })
              console.log({ currentStrikeAsk })

              console.log({ nextStrikeBid })
              console.log({ nextStrikeAsk })

              console.log({ oneGapperStrikeBid })
              console.log({ oneGapperStrikeAsk })

              console.log({ 'strikeIndex plus 1:': +strikeIndex + 1 })

              // console.log('checking next call!', _originalStrikeObjects[+strikeIndex+1] )
              // console.log('18', callStrikeObjects)
              // console.log('ob', _originalStrikeObjects)
              // console.log('checking next one gapper call!', _originalStrikeObjects[+strikeIndex+2] )

              const tightStrikeDistance = +nextStrike - +currentStrike

              if (tightStrikeDistance > this.MIN_STRIKE_DISTANCE) {

                const callSpreadTight = {
                  bpeffect: tightStrikeDistance - (currentStrikeBid - nextStrikeAsk),
                  bidAskDif: currentStrikeBid - nextStrikeAsk,
                  strikeDistance: tightStrikeDistance,
                  exp: callExpirationKey,
                  shortCallStrike: currentStrike,
                  longCallStrike: nextStrike,
                  currentStrikeBid,
                  nextStrikeAsk,
                  fillableCredit: currentStrikeBid - nextStrikeAsk,
                }

                callSpreads.push(callSpreadTight)
              }

              const oneGapperStrikeDistance = +oneGapperStrike - +currentStrike;

              if (oneGapperStrikeDistance > this.MIN_STRIKE_DISTANCE) {

                const callSpreadOneGapper = {
                  bpeffect: oneGapperStrikeDistance - (currentStrikeBid - oneGapperStrikeAsk),
                  bidAskDif: currentStrikeBid - oneGapperStrikeAsk,
                  strikeDistance: +oneGapperStrike - +currentStrike,
                  exp: callExpirationKey,
                  shortCallStrike: currentStrike,
                  longCallStrike: oneGapperStrike,
                  currentStrikeBid,
                  nextStrikeAsk: oneGapperStrikeAsk,
                  fillableCredit: currentStrikeBid - oneGapperStrikeAsk
                }

                callSpreads.push(callSpreadOneGapper)
              }

            }
            else {

              console.log('nope, call not OTM')
            }

            // if (callExpirationKey > )
          })

        callSpreads.sort((a, b) => {
          return a.bpeffect > b.bpeffect ? 1 : -1;
        })

        console.log({ callSpreads })

      })

    Object.keys(putExpDateMap)
      .forEach(putExpirationKey => {

        const putCurrentExpirationObj = putExpDateMap[putExpirationKey]

        console.log('current expiration: ', putExpirationKey)

        console.log({ putCurrentExpirationObj })

        console.log({ underlyingLast })

        const putStrikeObjects = Object.keys(putCurrentExpirationObj)

        console.log({ putStrikeObjects })

        putStrikeObjects.reverse()
          .forEach((currentStrike, strikeIndex, _originalStrikeObjects) => {

            console.log({ strikeIndex })

            if (+currentStrike < underlyingLast && strikeIndex < _originalStrikeObjects.length - 2) {

              const nextStrike = _originalStrikeObjects[+strikeIndex + 1]
              const oneGapperStrike = _originalStrikeObjects[+strikeIndex + 2]

              console.log('currentStrike: ', currentStrike)
              console.log('underlyingLast: ', underlyingLast)
              console.log({ nextStrike })
              console.log({ oneGapperStrike })

              const currentStrikeBid = putExpDateMap[putExpirationKey][currentStrike][0].bid;
              const currentStrikeAsk = putExpDateMap[putExpirationKey][currentStrike][0].ask;
              const nextStrikeBid = putExpDateMap[putExpirationKey][nextStrike][0].bid;
              const nextStrikeAsk = putExpDateMap[putExpirationKey][nextStrike][0].ask;
              const oneGapperStrikeBid = putExpDateMap[putExpirationKey][oneGapperStrike][0].bid;
              const oneGapperStrikeAsk = putExpDateMap[putExpirationKey][oneGapperStrike][0].ask;

              console.log({ currentStrikeBid })
              console.log({ currentStrikeAsk })

              console.log({ nextStrikeBid })
              console.log({ nextStrikeAsk })

              console.log({ oneGapperStrikeBid })
              console.log({ oneGapperStrikeAsk })

              console.log({ 'strikeIndex plus 1:': +strikeIndex + 1 })

              // console.log('checking next put!', _originalStrikeObjects[+strikeIndex+1] )
              // console.log('18', putStrikeObjects)
              // console.log('ob', _originalStrikeObjects)
              // console.log('checking next one gapper put!', _originalStrikeObjects[+strikeIndex+2] )

              const tightStrikeDistance = +currentStrike - +nextStrike

              if (tightStrikeDistance > this.MIN_STRIKE_DISTANCE) {

                const putSpreadTight = {
                  bpeffect: tightStrikeDistance - (currentStrikeBid - nextStrikeAsk),
                  midpointCredit: (currentStrikeAsk+currentStrikeBid)/2 - (nextStrikeAsk+nextStrikeBid)/2,
                  midpointBpEffect: tightStrikeDistance - (currentStrikeAsk+currentStrikeBid)/2 - (nextStrikeAsk+nextStrikeBid)/2,
                  bidAskDif: currentStrikeBid - nextStrikeAsk,
                  strikeDistance: tightStrikeDistance,
                  exp: putExpirationKey,
                  shortputStrike: currentStrike,
                  longputStrike: nextStrike,
                  currentStrikeBid,
                  nextStrikeAsk,
                  fillableCredit: currentStrikeBid - nextStrikeAsk,
                }
                
                console.log({ putSpreadTight })
                
                putSpreads.push(putSpreadTight)
              }
              
              const oneGapperStrikeDistance = +currentStrike - +oneGapperStrike;
              
              if (oneGapperStrikeDistance > this.MIN_STRIKE_DISTANCE) {
                
                const putSpreadOneGapper = {
                  bpeffect: oneGapperStrikeDistance - (currentStrikeBid - oneGapperStrikeAsk),
                  midpointCredit: (currentStrikeAsk+currentStrikeBid)/2 - (oneGapperStrikeAsk+oneGapperStrikeBid)/2,
                  midpointBpEffect: tightStrikeDistance - (currentStrikeAsk+currentStrikeBid)/2 - (oneGapperStrikeAsk+oneGapperStrikeBid)/2,
                  bidAskDif: currentStrikeBid - oneGapperStrikeAsk,
                  strikeDistance: +oneGapperStrike - +currentStrike,
                  exp: putExpirationKey,
                  shortputStrike: currentStrike,
                  longputStrike: oneGapperStrike,
                  currentStrikeBid,
                  nextStrikeAsk: oneGapperStrikeAsk,
                  fillableCredit: currentStrikeBid - oneGapperStrikeAsk
                }

                putSpreads.push(putSpreadOneGapper)
              }

            }
            else {

              console.log('nope, put not OTM')
            }

            // if (putExpirationKey > )
          })

        callSpreads.sort((a, b) => {
          return a.bpeffect > b.bpeffect ? 1 : -1;
        })

        putSpreads.sort((a, b) => {
          return a.midpointBpEffect > b.midpointBpEffect ? 1 : -1;
        })

        console.log({ callSpreads })
        console.log({ putSpreads })

      })

    return gudOnes;


  }

  // strangulate(callExpDateMap: any, putExpDateMap: any, underlyingLast: number, minAcceptableDelta: number,
  //   maxAcceptableDelta: number, minAcceptableGamma: number, maxAcceptableGamma: number) {

  //   const gudOnes = []

  //   console.log('strangulator be strangulating!');

  //   console.log({ callExpDateMap })

  //   // const hardcodedCallExpirationIndex = 0;

  //   const callExpirationKeys = Object.keys(callExpDateMap);

  //   Object.keys(callExpDateMap)
  //     .splice(0, 25)
  //     .forEach(callExpirationKey => {

  //       const callCurrentExpirationObj = callExpDateMap[callExpirationKey]
  //       // console.log(`expiration [${callExpirationKey}] calls: ${callCurrentExpirationObj}`);
  //       const currentCallExpiration = callExpirationKey;

  //       const putExpirationKeys = Object.keys(putExpDateMap);

  //       const putCurrentExpirationObj = putExpDateMap[callExpirationKey]
  //       // console.log(`expiration [${callExpirationKey}] puts: ${putCurrentExpirationObj}`);

  //       const callStrikeKeys = Object.keys(callExpDateMap[callExpirationKey]);
  //       const putStrikeKeys = Object.keys(putExpDateMap[callExpirationKey]);

  //       // const hardcodedCallStrikeIndex = 5;

  //       Object.keys(callCurrentExpirationObj).forEach((currentStrike, strikeIndex) => {


  //         const currentCall = callCurrentExpirationObj[currentStrike][0];
  //         const currentCallStrike = callStrikeKeys[strikeIndex];

  //         // const currentPut = putCurrentExpirationObj[putStrikeKeys[0]][0];

  //         // console.log('call with lowest strike: ', currentCall);

  //         if (this.hasNanGreeks(currentCall)) {
  //           // console.log('looks like call has bad greeks... ', currentCall.delta, ' ', currentCall.gamma, ' ', currentCall.theta)
  //         }
  //         else {
  //           // console.log('finding puts to match the call...')

  //           // only compare to puts of the SAME expiration cycle and which have a lower or equal strike.

  //           // console.log(`want to find puts for expiration: ${currentCallExpiration}, for strike: ${currentCallStrike}`)

  //           const putExpirationMapForCurrentCallExpiration = putExpDateMap[currentCallExpiration]

  //           // console.log(`put object with that expiration cycle: ${currentCallExpiration}, for strike: ${currentCallStrike}`)
  //           // console.log({ putExpirationMapForCurrentCallExpiration })

  //           const things = Object.entries(putExpirationMapForCurrentCallExpiration).map(([strike, putOptionArr]) => {

  //             // console.log('currentCallStrike: ', currentCallStrike, ', currentPutStrike', strike)

  //             const daysTilExpiration = +currentCallExpiration.slice(currentCallExpiration.indexOf(':')+1)
  //             console.log('daysTilExpiration ', daysTilExpiration)

  //             const maxDaysTilExpiration = 200;
  //             const minDaysTilExpiration = 40;

  //             const currentPut = putOptionArr[0]

  //             if (+strike > +currentCallStrike) {
  //               // console.log(`ignoring put with strike ${strike} because it is larger than call strike ${currentCallStrike}...`)
  //             }
  //             else {

  //               if (this.hasNanGreeks(currentPut)) {
  //                 // console.log('looks like put has bad greeks... ', currentPut.delta, ' ', currentPut.gamma, ' ', currentPut.theta)
  //               }
  //               else {

  //                 // console.log(`calculating greeks for expiration: ${currentCallExpiration}, call strike: ${currentCallStrike}, put strike: ${strike}!`)

  //                 const netGreeks = {
  //                   delta: currentCall.delta + currentPut.delta,
  //                   minDelta: minAcceptableDelta,
  //                   maxDelta: maxAcceptableDelta,
  //                   gamma: currentCall.gamma + currentPut.gamma,
  //                   minGamma: minAcceptableGamma,
  //                   maxGamma: maxAcceptableGamma,
  //                   theta: currentCall.theta + currentPut.theta,
  //                 }

  //                 // console.log('and the net greeks are...');
  //                 // console.table(netGreeks);

  //                 if (netGreeks.delta > minAcceptableDelta && netGreeks.delta < maxAcceptableDelta &&
  //                   netGreeks.gamma > minAcceptableGamma && netGreeks.gamma < maxAcceptableGamma &&
  //                   daysTilExpiration > minDaysTilExpiration && daysTilExpiration < maxDaysTilExpiration
  //                   ) {

  //                   const buyingPowerEffect = this.calculateBuyingPowerEffect(
  //                     underlyingLast,
  //                     +currentCallStrike,
  //                     +strike,
  //                     +currentCall.last,
  //                     +currentPut.last
  //                   )

  //                   const readableTheta = netGreeks.theta * 100

  //                   const thetaPower = readableTheta / buyingPowerEffect * 100;

  //                   console.log('call desc: ', currentCall.description)
  //                   const symbol = currentCall.description.slice(0, currentCall.description.indexOf(' '))

  //                   gudOnes.push({
  //                     symbol,
  //                     underlyingLast,
  //                     netDelta: netGreeks.delta * 100,
  //                     netGamma: netGreeks.gamma * 100,
  //                     netTheta: readableTheta,
  //                     callExpiration: currentCallExpiration,
  //                     callStrike: +currentCallStrike,
  //                     putExpiration: currentCallExpiration,
  //                     putStrike: +strike,
  //                     buyingPowerEffect,
  //                     thetaPower
  //                   })
  //                 }
  //               }
  //             }
  //           })
  //         }
  //       })
  //     })

  //   const gudOnesSorted = gudOnes.sort((a, b) => a.thetaPower > b.thetaPower ? 1 : -1)
  //   // const gudOnesSorted = gudOnes.sort((a, b) => a.netTheta > b.netTheta ? 1 : -1)
  //   console.log(gudOnesSorted.length)
  //   console.log('done calculating!')

  //   return gudOnesSorted;

  // }

  // private calculateBuyingPowerEffect(underlyingLast: number, callStrike: number, callPrice: number, putStrike: number, putPrice: number) {
  //   /**
  //     * 
  //     *  Tastyworks short strangle margin req:
  //     * 
  //     *   The margin requirements for a short straddle/strangle is the greater of the two sides' short uncovered margin requirement plus the premium of the other leg. 
  //     *       *The premium received from the sale of the strangle may be applied to the initial margin requirement. 
  //     * 
  //     *    ie. it's EITHER (higher of the two) the bpe of call + premium of put
  //     * 
  //     *    OR
  //     * 
  //     *    the bpe of the put + premium of the call
  //     */

  //   // All short options have a minimum BPE of $250
  //   const min250 = 250

  //   // Call Option Calcs

  //   const callAmountOTM = callStrike - underlyingLast;

  //   const callBpe20PercentRule = (0.2 * underlyingLast - callAmountOTM) * 100

  //   const callBpe10PercentRule = 0

  //   const callBpePlus50Rule = 0

  //   const callHighestBpeCalc = Math.max(callBpe20PercentRule, callBpe10PercentRule, callBpePlus50Rule, min250);

  //   // Put Option Calcs

  //   const putAmountOTM = underlyingLast - putStrike;

  //   const putBpe20PercentRule = (0.2 * underlyingLast - putAmountOTM) * 100

  //   const putBpe10PercentRule = 0

  //   const putBpePlus50Rule = 0

  //   const putHighestBpeCalc = Math.max(putBpe20PercentRule, putBpe10PercentRule, putBpePlus50Rule, min250);

  //   // Strangle BPE calc!

  //   const bpe = callHighestBpeCalc > putHighestBpeCalc ?
  //     callHighestBpeCalc + putPrice :
  //     putHighestBpeCalc + callPrice

  //   return bpe;

  //   // const callBpe = 0.20 * underlyingLast - Math.abs(callStrike - underlyingLast);
  //   // const callBpePlusPutPrem = callBpe + putPrice;

  //   // const putBpe = 0.20 * underlyingLast - Math.abs(putStrike - underlyingLast);
  //   // const putBpePlusCallPrem = putBpe + callPrice;

  //   // const buyingPowerEffect = Math.max(callBpePlusPutPrem, putBpePlusCallPrem);

  //   // const buyingPowerEstimate = netGreeks.theta * 100 / sumOfMarks;
  // }

  // private hasNanGreeks(currentCallOrPut) {

  //   // console.log('checking option\'s greeks: ', currentCallOrPut)

  //   if (
  //     !currentCallOrPut.theta ||
  //     !currentCallOrPut.delta ||
  //     !currentCallOrPut.gamma ||
  //     currentCallOrPut.delta == 'N/A' ||
  //     currentCallOrPut.delta == 'n/a' ||
  //     currentCallOrPut.delta == 'Nan' ||
  //     currentCallOrPut.delta == 'NaN' ||
  //     currentCallOrPut.gamma == 'N/A' ||
  //     currentCallOrPut.gamma == 'n/a' ||
  //     currentCallOrPut.gamma == 'Nan' ||
  //     currentCallOrPut.gamma == 'NaN' ||
  //     currentCallOrPut.theta == 'N/A' ||
  //     currentCallOrPut.theta == 'n/a' ||
  //     currentCallOrPut.theta == 'Nan' ||
  //     currentCallOrPut.theta == 'NaN'
  //   ) {

  //     // console.log('the greeks are NaN!')
  //     return true;
  //   }

  //   return false;
  // }

}
