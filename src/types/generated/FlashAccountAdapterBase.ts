// Generated type for FlashAccountAdapterBase
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { FlashAccountAdapterBaseAbi } from './index';

export type FlashAccountAdapterBaseAbiType = typeof FlashAccountAdapterBaseAbi;

/**
 * Creates a contract instance for FlashAccountAdapterBase
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getFlashAccountAdapterBaseContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: FlashAccountAdapterBaseAbi as Abi,
    client: publicClient
  });
}
