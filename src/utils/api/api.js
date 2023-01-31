import bffEndpoints from './endpoints/bff'
import hdxetfsystemApiEndpoints from './endpoints/hdxetfsystem'
import msvcAccountEndpoints from './endpoints/msvc-account'
import msvcPrimaryMarketMgmtEndpoints from './endpoints/msvc-primary-market-mgmt'
import msvcAuctionTradingEndpoints from './endpoints/msvc-auction-trading'
import msvcNotifierEndpoints from './endpoints/msvc-notifier'

export default {
  ...bffEndpoints,
  ...hdxetfsystemApiEndpoints,
  ...msvcAccountEndpoints,
  ...msvcPrimaryMarketMgmtEndpoints,
  ...msvcAuctionTradingEndpoints,
  ...msvcNotifierEndpoints,
}
