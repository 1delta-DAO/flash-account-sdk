import { type Address } from "viem";
import { COMPOUND_V2_STYLE_TOKENS, ASSET_META } from "@1delta/asset-registry";

const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address;

// Todo: Hardcoded Aave pools for now
const AAVE_POOL_ADDRESSES: Record<number, Address> = {
  1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2" as Address,
};

/**
 * Check if a token is ETH
 */
export function isETH(token: Address): boolean {
  return (
    token.toLowerCase() === ETH_ADDRESS.toLowerCase() ||
    token === "0x0000000000000000000000000000000000000000"
  );
}

/**
 * Get Aave V3 pool address for a chain
 */
export function getAaveV3PoolAddress(chainId: number): Address {
  if (AAVE_POOL_ADDRESSES[chainId]) {
    return AAVE_POOL_ADDRESSES[chainId];
  }
  throw new Error(`Aave V3 pool not found for chain ${chainId}`);
}

/**
 * Get Compound V2 Comptroller address for a chain
 * TODO: Use asset-registry
 */
export function getCompoundComptrollerAddress(chainId: number): Address {
  if (chainId === 1) {
    return "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B" as Address;
  }
  throw new Error(`Compound V2 comptroller not found for chain ${chainId}`);
}

/**
 * Resolve token address from a symbol using asset-registry
 */
export function resolveTokenAddress(symbol: string, chainId: number): Address {
  // Check if it's ETH
  if (symbol.toUpperCase() === "ETH") {
    return ETH_ADDRESS;
  }

  if (ASSET_META) {
    for (const groupKey in ASSET_META) {
      const group = ASSET_META[groupKey];

      for (const tokenKey in group) {
        if (tokenKey.toUpperCase() === symbol.toUpperCase()) {
          const tokenDetails = group[tokenKey];

          if (Array.isArray(tokenDetails)) {
            for (const detail of tokenDetails) {
              if (detail.chainId == chainId && detail.address) {
                return detail.address as Address;
              }
            }
          }
        }
      }
    }
  }

  throw new Error(`Token ${symbol} not found in registry for chain ${chainId}`);
}

/**
 * Resolve token and cToken addresses for Compound V2 using asset-registry
 */
export function resolveCompoundTokenAddresses(
  token: Address | string,
  chainId: number,
  protocolToken?: Address
): { underlying: Address; cToken: Address } {
  // If protocol token is provided, use it
  if (protocolToken) {
    const underlyingAddress =
      typeof token === "string" && !token.startsWith("0x")
        ? resolveTokenAddress(token, chainId)
        : (token as Address);

    return {
      underlying: underlyingAddress,
      cToken: protocolToken,
    };
  }

  // Handle ETH
  if (
    token === "ETH" ||
    (typeof token === "string" &&
      token.toLowerCase() === ETH_ADDRESS.toLowerCase())
  ) {
    // Find cETH in registry
    const cETH = getCTokenForToken(ETH_ADDRESS, chainId);
    if (!cETH) {
      throw new Error(`cETH not available on chain ${chainId}`);
    }
    return {
      underlying: ETH_ADDRESS,
      cToken: cETH,
    };
  }

  // If token is a symbol, resolve from registry
  if (typeof token === "string" && !token.startsWith("0x")) {
    // Use asset registry to find token address
    const underlyingAddress = resolveTokenAddress(token, chainId);

    // Find corresponding cToken in Compound registry
    const cToken = getCTokenForToken(underlyingAddress, chainId);
    if (!cToken) {
      throw new Error(
        `cToken for ${token} not found in registry for chain ${chainId}`
      );
    }

    return {
      underlying: underlyingAddress,
      cToken,
    };
  }

  // If token is an address, look up cToken in registry
  const cToken = getCTokenForToken(token as Address, chainId);
  if (!cToken) {
    throw new Error(
      `Could not resolve cToken for address ${token}. Please provide cToken address directly using protocolToken parameter.`
    );
  }

  return {
    underlying: token as Address,
    cToken,
  };
}

/**
 * Helper to get cToken address for an underlying token
 */
function getCTokenForToken(
  tokenAddress: Address,
  chainId: number
): Address | null {
  for (const protocol in COMPOUND_V2_STYLE_TOKENS) {
    if (
      COMPOUND_V2_STYLE_TOKENS[protocol] &&
      COMPOUND_V2_STYLE_TOKENS[protocol][chainId]
    ) {
      const chainTokens = COMPOUND_V2_STYLE_TOKENS[protocol][chainId];
      const lowerTokenAddress = tokenAddress.toLowerCase() as Address;

      // Check for exact match or for ETH special case
      if (chainTokens[lowerTokenAddress]) {
        return chainTokens[lowerTokenAddress] as Address;
      }

      // Special case for ETH (sometimes mapped to zero address)
      if (
        isETH(tokenAddress) &&
        chainTokens["0x0000000000000000000000000000000000000000"]
      ) {
        return chainTokens[
          "0x0000000000000000000000000000000000000000"
        ] as Address;
      }
    }
  }

  return null;
}
