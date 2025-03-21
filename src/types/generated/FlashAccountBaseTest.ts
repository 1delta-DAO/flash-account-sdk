// Generated type for FlashAccountBaseTest
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { FlashAccountBaseTestAbi } from './index';

export type FlashAccountBaseTestAbiType = typeof FlashAccountBaseTestAbi;

/**
 * Creates a contract instance for FlashAccountBaseTest
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getFlashAccountBaseTestContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: FlashAccountBaseTestAbi as Abi,
    client: publicClient
  });
}
