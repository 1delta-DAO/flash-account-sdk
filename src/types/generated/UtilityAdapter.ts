// Generated type for UtilityAdapter
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { UtilityAdapterAbi } from './index';

export type UtilityAdapterAbiType = typeof UtilityAdapterAbi;

/**
 * Creates a contract instance for UtilityAdapter
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getUtilityAdapterContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: UtilityAdapterAbi as Abi,
    client: publicClient
  });
}
