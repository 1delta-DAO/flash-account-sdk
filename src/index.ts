// Export types
export type {
  FlashLoanParams,
  SupplyParams,
  WithdrawParams,
  BorrowParams,
  RepayParams,
} from "./types/protocols";

// Export ABIs
export { AAVE_V3_POOL_ABI } from "./abis/aave";
export { CTOKEN_ABI, COMPTROLLER_ABI } from "./abis/compound";

// Export token utilities
export {
  isETH,
  resolveCompoundTokenAddresses,
  getAaveV3PoolAddress,
  getCompoundComptrollerAddress,
} from "./assets";

// Export protocol functions
export { createFlashLoanCall } from "./protocols/flashLoans";
export {
  createSupplyCalls,
  createWithdrawCalls,
  createBorrowCalls,
  createRepayCalls,
} from "./protocols/lending";

// Export bundler client
export { createDeFiBundlerClient } from "./core/client";
