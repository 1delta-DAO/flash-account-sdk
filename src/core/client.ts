import { type Address, type Chain, type Hex, type Transport } from "viem";
import type {
  BundlerClient,
  BundlerClientConfig,
  SmartAccount,
} from "viem/account-abstraction";
import { createBundlerClient } from "viem/account-abstraction";

import { createFlashLoanCall } from "../protocols/flashLoans";
import {
  createSupplyCalls,
  createWithdrawCalls,
  createBorrowCalls,
  createRepayCalls,
  createEnterMarketsCall,
} from "../protocols/lending";

/**
 * Create a DeFi-ready bundler client with flash loan and lending capabilities
 */
export function createFlashAccountBundlerClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartAccount | undefined = SmartAccount | undefined,
>(
  parameters: BundlerClientConfig<TTransport, TChain, TAccount>
): BundlerClient<TTransport, TChain, TAccount> & {
  // Flash loan operations
  FlashLoan: (params: {
    token: Address | Address[];
    amount: bigint | bigint[];
    receiver: Address;
    userData?: Hex;
    provider?: "aaveV3";
    chainId: number;
    entryPointAddress: Address;
  }) => Promise<Hex>;

  // Compound V2 operations
  compV2_supplyAsset: (params: {
    token: Address | string;
    amount: bigint;
    chainId: number;
    protocolToken?: Address;
    entryPointAddress: Address;
  }) => Promise<Hex>;

  compV2_withdrawAsset: (params: {
    token: Address | string;
    amount: bigint;
    chainId: number;
    protocolToken?: Address;
    withdrawAll?: boolean;
    entryPointAddress: Address;
  }) => Promise<Hex>;

  compV2_borrowAsset: (params: {
    token: Address | string;
    amount: bigint;
    chainId: number;
    protocolToken?: Address;
    entryPointAddress: Address;
  }) => Promise<Hex>;

  compV2_repayAsset: (params: {
    token: Address | string;
    amount: bigint;
    chainId: number;
    protocolToken?: Address;
    repayAll?: boolean;
    borrower?: Address;
    entryPointAddress: Address;
  }) => Promise<Hex>;

  compV2_enterMarkets: (params: {
    markets: Address[];
    chainId: number;
    entryPointAddress: Address;
  }) => Promise<Hex>;
} {
  // Create base bundler client
  const bundlerClient = createBundlerClient(parameters);

  return {
    ...bundlerClient,

    // Flash loan operation
    async FlashLoan(params) {
      const {
        token,
        amount,
        receiver,
        userData,
        provider,
        chainId,
        entryPointAddress,
      } = params;

      // Check account
      if (!bundlerClient.account) {
        throw new Error("No account provided to bundler client");
      }

      // Create flash loan call
      const call = createFlashLoanCall({
        token,
        amount,
        receiver,
        userData,
        provider,
        chainId,
      });

      // Send user operation
      return bundlerClient.sendUserOperation({
        calls: [call],
        entryPointAddress,
      });
    },

    // Supply assets to Compound V2
    async compV2_supplyAsset(params) {
      const { token, amount, chainId, protocolToken, entryPointAddress } =
        params;

      // Check account
      if (!bundlerClient.account) {
        throw new Error("No account provided to bundler client");
      }

      // Create supply calls
      const calls = createSupplyCalls({
        token,
        amount,
        chainId,
        protocolToken,
      });

      // Send user operation
      return bundlerClient.sendUserOperation({
        calls,
        entryPointAddress,
      });
    },

    // Withdraw assets from Compound V2
    async compV2_withdrawAsset(params) {
      const {
        token,
        amount,
        chainId,
        protocolToken,
        withdrawAll,
        entryPointAddress,
      } = params;

      // Check account
      if (!bundlerClient.account) {
        throw new Error("No account provided to bundler client");
      }

      // Create withdraw calls
      const calls = createWithdrawCalls({
        token,
        amount,
        chainId,
        protocolToken,
        withdrawAll,
      });

      // Send user operation
      return bundlerClient.sendUserOperation({
        calls,
        entryPointAddress,
      });
    },

    // Borrow assets from Compound V2
    async compV2_borrowAsset(params) {
      const { token, amount, chainId, protocolToken, entryPointAddress } =
        params;

      // Check account
      if (!bundlerClient.account) {
        throw new Error("No account provided to bundler client");
      }

      // Create borrow calls
      const calls = createBorrowCalls({
        token,
        amount,
        chainId,
        protocolToken,
      });

      // Send user operation
      return bundlerClient.sendUserOperation({
        calls,
        entryPointAddress,
      });
    },

    // Repay borrowed assets to Compound V2
    async compV2_repayAsset(params) {
      const {
        token,
        amount,
        chainId,
        protocolToken,
        repayAll,
        borrower,
        entryPointAddress,
      } = params;

      // Check account
      if (!bundlerClient.account) {
        throw new Error("No account provided to bundler client");
      }

      // Create repay calls
      const calls = createRepayCalls({
        token,
        amount,
        chainId,
        protocolToken,
        repayAll,
        borrower,
      });

      // Send user operation
      return bundlerClient.sendUserOperation({
        calls,
        entryPointAddress,
      });
    },

    // Enter markets in Compound V2
    async compV2_enterMarkets(params) {
      const { markets, chainId, entryPointAddress } = params;

      // Check account
      if (!bundlerClient.account) {
        throw new Error("No account provided to bundler client");
      }

      // Create enter markets call
      const call = createEnterMarketsCall(chainId, markets);

      // Send user operation
      return bundlerClient.sendUserOperation({
        calls: [call],
        entryPointAddress,
      });
    },
  };
}
