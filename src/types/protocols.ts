import type { Address, Hex } from "viem";

/**
 * Flash loan parameters with single or multiple tokens
 */
export interface FlashLoanParams {
  token: Address | Address[];
  amount: bigint | bigint[];
  receiver: Address;
  userData?: Hex;
  provider?: "aaveV3";
  chainId: number;
}

/**
 * Common parameters for lending operations
 */
export interface LendingBaseParams {
  token: Address | string;
  amount: bigint;
  chainId: number;
}

/**
 * Supply/deposit parameters for lending protocols
 */
export interface SupplyParams extends LendingBaseParams {
  protocolToken?: Address;
}

/**
 * Withdraw parameters for lending protocols
 */
export interface WithdrawParams extends LendingBaseParams {
  protocolToken?: Address;
  withdrawAll?: boolean;
}

/**
 * Borrow parameters for lending protocols
 */
export interface BorrowParams extends LendingBaseParams {
  protocolToken?: Address;
}

/**
 * Repay parameters for lending protocols
 */
export interface RepayParams extends LendingBaseParams {
  protocolToken?: Address;
  repayAll?: boolean;
  borrower?: Address;
}
