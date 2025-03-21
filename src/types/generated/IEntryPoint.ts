// Generated type for IEntryPoint
import { createPublicClient, http, getContract } from 'viem';
import type { Abi, Address } from 'viem';
import { IEntryPointAbi } from './index';

export type IEntryPointAbiType = typeof IEntryPointAbi;

/**
 * Creates a contract instance for IEntryPoint
 * @param address The address of the contract
 * @param rpcUrl The RPC URL to connect to
 * @returns A contract instance with type-safe methods
 */
export function getIEntryPointContract(
  address: Address, 
  rpcUrl: string
) {
  const publicClient = createPublicClient({
    transport: http(rpcUrl)
  });
  
  return getContract({
    address,
    abi: IEntryPointAbi as Abi,
    client: publicClient
  });
}
