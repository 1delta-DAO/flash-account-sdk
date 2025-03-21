// Generated type for FlashAccountBase
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { FlashAccountBaseAbi } from './index';

export type FlashAccountBaseAbiType = typeof FlashAccountBaseAbi;

/**
 * Creates a contract instance for FlashAccountBase
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getFlashAccountBaseContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: FlashAccountBaseAbi as Abi,
    client: publicClient
  });
}
