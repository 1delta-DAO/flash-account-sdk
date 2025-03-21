import { type Address, type Hex, encodeFunctionData } from "viem";
import type { FlashLoanParams } from "../types/protocols";
import { AAVE_V3_POOL_ABI } from "../abis/aave";
import { getAaveV3PoolAddress } from "../assets";
import { FlashAccountAbi } from "../types/generated";

// Extract the execute function ABI for FlashAccount
const FLASH_ACCOUNT_EXECUTE_ABI = [
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "dest", type: "address" },
      { name: "value", type: "uint256" },
      { name: "func", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

/**
 * Create calldata for a flash loan executed via FlashAccount
 * The FlashAccount will receive the flash loan and handle the callback
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
    receiver, // This is the FlashAccount address
    userData = "0x",
    provider = "aaveV3",
    chainId,
  } = params;

  // Get Aave provider address based on chain via asset-registry
  let aavePoolAddress: Address;
  if (provider === "aaveV3") {
    aavePoolAddress = getAaveV3PoolAddress(chainId);
  } else {
    throw new Error(`Flash loan provider ${provider} not implemented`);
  }

  // Determine if it's a single token or multi-token flash loan
  const isSingleToken = !Array.isArray(token);

  // Create the calldata for flash loan call to Aave
  let aaveCalldata: Hex;

  if (isSingleToken) {
    // Single token flash loan - receiver is the FlashAccount itself
    // The FlashAccount implements the executeOperation callback required by Aave
    aaveCalldata = encodeFunctionData({
      abi: AAVE_V3_POOL_ABI,
      functionName: "flashLoanSimple",
      args: [
        receiver, // The FlashAccount itself will handle the executeOperation callback
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

    aaveCalldata = encodeFunctionData({
      abi: AAVE_V3_POOL_ABI,
      functionName: "flashLoan",
      args: [
        receiver, // The FlashAccount itself will handle the executeOperation callback
        tokens,
        amounts,
        Array(tokens.length).fill(0n), // modes: 0 = no debt
        receiver, // onBehalfOf is also the FlashAccount
        userData,
        0, // referralCode
      ],
    });
  }

  // Create the execute call for the FlashAccount
  // The execute function will then make the call to Aave's flash loan
  return {
    to: receiver, // This is the FlashAccount address
    value: 0n, // No ETH needed for flash loans
    data: encodeFunctionData({
      abi: FLASH_ACCOUNT_EXECUTE_ABI,
      functionName: "execute",
      args: [
        aavePoolAddress, // Destination is the Aave pool
        0n, // No ETH value to send
        aaveCalldata, // Function data for the flash loan call
      ],
    }),
  };
}
