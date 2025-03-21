// Generated type for FlashAccountFactory
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { FlashAccountFactoryAbi } from './index';

export type FlashAccountFactoryAbiType = typeof FlashAccountFactoryAbi;

/**
 * Creates a contract instance for FlashAccountFactory
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getFlashAccountFactoryContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: FlashAccountFactoryAbi as Abi,
    client: publicClient
  });
}
