// Generated type for CompoundV2Adapter
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { CompoundV2AdapterAbi } from './index';

export type CompoundV2AdapterAbiType = typeof CompoundV2AdapterAbi;

/**
 * Creates a contract instance for CompoundV2Adapter
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getCompoundV2AdapterContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: CompoundV2AdapterAbi as Abi,
    client: publicClient
  });
}
