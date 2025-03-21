// Generated type for FlashAccount
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { FlashAccountAbi } from './index';

export type FlashAccountAbiType = typeof FlashAccountAbi;

/**
 * Creates a contract instance for FlashAccount
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getFlashAccountContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: FlashAccountAbi as Abi,
    client: publicClient
  });
}
