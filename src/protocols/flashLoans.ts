import { type Address, type Hex, encodeFunctionData } from "viem";
import type { FlashLoanParams } from "../types/protocols";
import { AAVE_V3_POOL_ABI } from "../abis/aave";
import { getAaveV3PoolAddress } from "../assets";

/**
 * Create calldata for a flash loan
 * @param params Flash loan parameters
 * @returns The call object for the user operation
 */
export function createFlashLoanCall(params: FlashLoanParams): {
  to: Address;
  value: bigint;
  data: Hex;
} {
  const {
    token,
    amount,
    receiver,
    userData = "0x",
    provider = "aaveV3",
    chainId,
  } = params;

  // Get provider address based on chain via asset-registry
  let providerAddress: Address;
  if (provider === "aaveV3") {
    providerAddress = getAaveV3PoolAddress(chainId);
  } else {
    throw new Error(`Flash loan provider ${provider} not implemented`);
  }

  // Determine if it's a single token or multi-token flash loan
  const isSingleToken = !Array.isArray(token);

  let data: Hex;

  if (isSingleToken) {
    // Single token flash loan
    data = encodeFunctionData({
      abi: AAVE_V3_POOL_ABI,
      functionName: "flashLoanSimple",
      args: [
        receiver,
        token as Address,
        amount as bigint,
        userData,
        0, // referralCode
      ],
    });
  } else {
    // Multi-token flash loan
    const tokens = token as Address[];
    const amounts = Array.isArray(amount)
      ? amount
      : Array(tokens.length).fill(amount);

    if (tokens.length !== amounts.length) {
      throw new Error("Number of tokens must match number of amounts");
    }

    data = encodeFunctionData({
      abi: AAVE_V3_POOL_ABI,
      functionName: "flashLoan",
      args: [
        receiver,
        tokens,
        amounts,
        Array(tokens.length).fill(0n), // modes: 0 = no debt
        receiver, // onBehalfOf
        userData,
        0, // referralCode
      ],
    });
  }

  return {
    to: providerAddress,
    value: 0n, // Flash loans don't require value
    data,
  };
}
