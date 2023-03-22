
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TdApiService, BuyOrSell } from '../../services/td-api/td-api.service';
import { ToastManagerService } from '../../services/toast-manager/toast-manager.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EnableGainslockerModalService } from '../../components/modals/enable-gainslock-confirm/enable-gainslock-modal.service';
import { AskCancelOrderModalService } from '../../components/modals/ask-cancel-order/ask-cancel-order-modal.service';
import { AskPlaceTradeModalService } from 'src/app/components/modals/ask-place-trade/ask-place-trade-modal.service';
import { interval } from 'rxjs';
import { decideLimitPrice } from 'src/app/services/limit-price-decider';
import { decideBuyOrSell } from 'src/app/services/buy-or-sell-decider';
import { StrangulatorService } from 'src/app/strangulator.service';
import { CizablePutsScanner } from 'src/app/cizable-puts-scanner.service';
import { CizableCallsScanner } from 'src/app/cizable-calls-scanner.service';


@Component({
  selector: 'app-trade-bot-page',
  templateUrl: './trade-bot-page.component.html',
  styleUrls: ['./trade-bot-page.component.scss'],
})
export class TradeBotPageComponent {

  accountNumber: string;

  accountsData: any;

  largecapTickers = ['TSM', 'TSLA', 'BABA', 'WMT', 'DIS', 'BAC', 'NVDA', 'PYPL', 'INTC', 'NFLX', 'NKE', 'QCOM', 'UPS', 'BA', 'JD', 'UNH']
  // largecapTickers = []
  // etfTickers = ['IWM', 'QQQ', 'EEM', 'EWZ', 'IWM', 'XLF', 'SQQQ', 'SLV', 'GDX', 'XLE', 'SHY', 'VOO', 'VTI']
  etfTickers = []
  // memeStonkTickers = ['GME', 'AMC', 'MVIS', 'VIAC', 'RKT', 'AMD', 'MSFT', 'PLTR', 'TLRY', 'NIO', 'UBER', 'APHA', 'EBAY', 'TSLA']
  memeStonkTickers = []
  // bestInClassTickers = ['GOOG', 'AAPL', 'AMZN', 'HD', 'WMT', 'MA', 'V', 'NKE', 'GOOGL', 'ATBI', 'VZ']
  bestInClassTickers = []
  // highIvs = ['SIVB', 'SJR', 'CHTR', 'COST', 'HD', 'WMT', 'V', 'ADBE', 'NKE', 'GOOGL', 'TROW', 'KMX', 'D', 'FDX', 'MRNA', 'GSK', 'VALE', 'EL', 'SHW' ]
  highPrices = ['UNH', 'BKNG', 'CMG', 'INTU', 'COST', 'ADBE', 'MTD', 'NVDA', 'MSFT', 'META', 'SGFY', 'MKL', 'MELI', 'ORLY', 'FCNCA', 'REGN', 'TDG', 'EQIX', 'BLK', 'FICO', 'GWW', 'ASML', 'AVGO', 'ULTA', 'HUM', 'DE', 'LMT', 'TMO', 'PLTK', 'E', 'CHKP', 'NEP', 'UNIT', 'GGAL', 'CYH', 'SOXL', 'SBNY', 'RIOT']
  // highPrices = []

  rowsInTickerTable = 0;
  arrayOfRowIndicies = [];

  allSymbols = [];

  strangulations = [];
  shortCrunchedCondors = [];
  cizablePutsGroupedBySymbol = [];
  cizableCallsGroupedBySymbol = [];

  constructor(private http: HttpClient,
    private tdApiSvc: TdApiService,
    private cizablePutsScanner: CizablePutsScanner,
    private cizableCallsScanner: CizableCallsScanner,
  ) { }

  access_token = ''

  gotTdData = false

  async ngOnInit() {

    this.allSymbols = [
      ...this.largecapTickers,
      ...this.etfTickers,
      ...this.memeStonkTickers,
      ...this.bestInClassTickers,
      ...this.highPrices
    ]

    this.rowsInTickerTable = Math.max(
      this.largecapTickers.length,
      this.etfTickers.length,
      this.memeStonkTickers.length,
      this.bestInClassTickers.length,
      this.highPrices.length,
    );

    this.arrayOfRowIndicies = Array.from(Array(this.rowsInTickerTable).keys())

    if (!this.accountsData) {

      this.accountsData = await this.tdApiSvc.getPositions();

      this.allSymbols.forEach(async symbol => {

        const optionChain = await this.tdApiSvc.getOptionChainForSymbol(symbol);
        console.log('chainnnn: ', optionChain)

        // const minAcceptableDelta = -0.05
        // const maxAcceptableDelta = 0.04

        // const minAcceptableGamma = -0.05
        // const maxAcceptableGamma = 0.05

        if (optionChain['underlying']) {

          console.log('1a')

          // const cizablePutsForSymbol = this.cizablePutsScanner.getCizablePutsForSymbol(
          //   optionChain['symbol'],
          //   optionChain['putExpDateMap'],
          //   optionChain['underlying']['last']
          // )

          // this.cizablePutsGroupedBySymbol.push(cizablePutsForSymbol);

          const cizableCallsForSymbol = this.cizableCallsScanner.getCizableCallsForSymbol(
            optionChain['symbol'],
            optionChain['callExpDateMap'],
            optionChain['underlying']['last']
          )
          console.log('1b')

          this.cizableCallsGroupedBySymbol.push(cizableCallsForSymbol);

          this.cizableCallsGroupedBySymbol = this.cizableCallsGroupedBySymbol.filter(cizableCallsForSymbol => {
            return cizableCallsForSymbol.length > 0;
          })

          this.cizablePutsGroupedBySymbol = this.cizablePutsGroupedBySymbol.sort((a, b) => {
            // return a[0].intrinsic_profit_ask < b[0].intrinsic_profit_ask ? 1 : -1;
            return a[0].intrinsic_profit_midpt < b[0].intrinsic_profit_midpt ? 1 : -1;
            return a[0].intrinsic_profit_per_doller_midpt < b[0].intrinsic_profit_per_doller_midpt ? 1 : -1;
          })

          this.cizableCallsGroupedBySymbol = this.cizableCallsGroupedBySymbol.filter(cizableCallsForSymbol => {
            return cizableCallsForSymbol.length > 0;
          })

          this.cizableCallsGroupedBySymbol = this.cizableCallsGroupedBySymbol.sort((a, b) => {
            // return a[0].intrinsic_profit_ask < b[0].intrinsic_profit_ask ? 1 : -1;
            return a[0].intrinsic_profit_midpt < b[0].intrinsic_profit_midpt ? 1 : -1;
            return a[0].intrinsic_profit_per_doller_midpt < b[0].intrinsic_profit_per_doller_midpt ? 1 : -1;
          })

          console.log('the gud puts are..... ', this.cizablePutsGroupedBySymbol);
          console.log('the gud calls are..... ', this.cizableCallsGroupedBySymbol);
          console.log('cizable puts!');
          console.log('1c')
        }

      })

    }

  }

}
