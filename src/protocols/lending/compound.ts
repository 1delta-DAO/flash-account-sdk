import { type Address, type Hex, encodeFunctionData } from "viem";
import type {
  SupplyParams,
  WithdrawParams,
  BorrowParams,
  RepayParams,
} from "../../types/protocols";
import { ERC20_ABI } from "../../abis/erc20";
import { CTOKEN_ABI, COMPTROLLER_ABI } from "../../abis/compound";
import {
  resolveCompoundTokenAddresses,
  isETH,
  getCompoundComptrollerAddress,
} from "../../assets";

/**
 * Create calls for supplying assets to Compound V2
 * @param params Supply parameters
 * @returns Array of calls for the user operation
 */
export function createSupplyCalls(
  params: SupplyParams
): Array<{ to: Address; value: bigint; data: Hex }> {
  const { token, amount, chainId, protocolToken } = params;

  // Resolve token addresses using asset-registry
  const { underlying, cToken } = resolveCompoundTokenAddresses(
    token,
    chainId,
    protocolToken
  );

  const calls: Array<{ to: Address; value: bigint; data: Hex }> = [];

  if (isETH(underlying)) {
    // Supply ETH
    const mintData = encodeFunctionData({
      abi: CTOKEN_ABI,
      functionName: "mint",
      args: [],
    });

    calls.push({
      to: cToken,
      value: amount,
      data: mintData,
    });
  } else {
    // For ERC20 tokens: approve then mint
    const approvalData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "approve",
      args: [cToken, amount],
    });

    const mintData = encodeFunctionData({
      abi: CTOKEN_ABI,
      functionName: "mint",
      args: [amount],
    });

    calls.push({
      to: underlying,
      value: 0n,
      data: approvalData,
    });

    calls.push({
      to: cToken,
      value: 0n,
      data: mintData,
    });
  }

  return calls;
}

/**
 * Create calls for withdrawing assets from Compound V2
 * @param params Withdraw parameters
 * @returns Array of calls for the user operation
 */
export function createWithdrawCalls(
  params: WithdrawParams
): Array<{ to: Address; value: bigint; data: Hex }> {
  const { token, amount, chainId, protocolToken, withdrawAll } = params;

  // Resolve token addresses using asset-registry
  const { cToken } = resolveCompoundTokenAddresses(
    token,
    chainId,
    protocolToken
  );

  // Decide which function to call based on withdrawAll flag
  if (withdrawAll) {
    // Use redeem to withdraw all (token amount rather than underlying)
    const redeemData = encodeFunctionData({
      abi: CTOKEN_ABI,
      functionName: "redeem",
      args: [amount], // This should be the cToken amount, not underlying amount
    });

    return [
      {
        to: cToken,
        value: 0n,
        data: redeemData,
      },
    ];
  } else {
    // Use redeemUnderlying to withdraw specific amount of underlying
    const redeemData = encodeFunctionData({
      abi: CTOKEN_ABI,
      functionName: "redeemUnderlying",
      args: [amount],
    });

    return [
      {
        to: cToken,
        value: 0n,
        data: redeemData,
      },
    ];
  }
}

/**
 * Create calls for borrowing assets from Compound V2
 * @param params Borrow parameters
 * @returns Array of calls for the user operation
 */
export function createBorrowCalls(
  params: BorrowParams
): Array<{ to: Address; value: bigint; data: Hex }> {
  const { token, amount, chainId, protocolToken } = params;

  // Resolve token addresses using asset-registry
  const { cToken } = resolveCompoundTokenAddresses(
    token,
    chainId,
    protocolToken
  );

  const borrowData = encodeFunctionData({
    abi: CTOKEN_ABI,
    functionName: "borrow",
    args: [amount],
  });

  return [
    {
      to: cToken,
      value: 0n,
      data: borrowData,
    },
  ];
}

/**
 * Create calls for repaying borrowed assets in Compound V2
 * @param params Repay parameters
 * @returns Array of calls for the user operation
 */
export function createRepayCalls(
  params: RepayParams
): Array<{ to: Address; value: bigint; data: Hex }> {
  const { token, amount, chainId, protocolToken, repayAll, borrower } = params;

  // Resolve token addresses using asset-registry
  const { underlying, cToken } = resolveCompoundTokenAddresses(
    token,
    chainId,
    protocolToken
  );

  const calls: Array<{ to: Address; value: bigint; data: Hex }> = [];

  if (isETH(underlying)) {
    // Repay ETH borrow (this would require a special wrapper in Compound)
    throw new Error(
      "Direct ETH repayment not supported. Convert to WETH first."
    );
  } else {
    // For ERC20 tokens: approve then repay
    const approvalData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: "approve",
      args: [cToken, amount],
    });

    calls.push({
      to: underlying,
      value: 0n,
      data: approvalData,
    });

    // If repaying for someone else
    if (borrower) {
      const repayData = encodeFunctionData({
        abi: CTOKEN_ABI,
        functionName: "repayBorrowBehalf",
        args: [borrower, repayAll ? 2n ** 256n - 1n : amount], // max uint for repayAll
      });

      calls.push({
        to: cToken,
        value: 0n,
        data: repayData,
      });
    } else {
      // Repaying own borrow
      const repayData = encodeFunctionData({
        abi: CTOKEN_ABI,
        functionName: "repayBorrow",
        args: [repayAll ? 2n ** 256n - 1n : amount], // max uint for repayAll
      });

      calls.push({
        to: cToken,
        value: 0n,
        data: repayData,
      });
    }
  }

  return calls;
}

/**
 * Create calls for entering markets in Compound V2
 * @param chainId Chain ID
 * @param markets Array of cToken addresses to enter
 * @returns The call object for the user operation
 */
export function createEnterMarketsCall(
  chainId: number,
  markets: Address[]
): { to: Address; value: bigint; data: Hex } {
  // Get comptroller address from asset-registry
  const comptrollerAddress = getCompoundComptrollerAddress(chainId);

  const enterMarketsData = encodeFunctionData({
    abi: COMPTROLLER_ABI,
    functionName: "enterMarkets",
    args: [markets],
  });

  return {
    to: comptrollerAddress,
    value: 0n,
    data: enterMarketsData,
  };
}
