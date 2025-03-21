import { expect, test, describe } from "bun:test";
import {
  createFlashLoanCall,
  isETH,
  getAaveV3PoolAddress,
  getCompoundComptrollerAddress,
} from "../src";
import { type Address, encodeFunctionData } from "viem";
import { AAVE_V3_POOL_ABI } from "../src/abis/aave";
import { COMPTROLLER_ABI } from "../src/abis/compound";
import { createEnterMarketsCall as compoundCreateEnterMarketsCall } from "../src/protocols/lending/compound";

const TEST_ENTRY_POINT =
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" as Address;

const TEST_RECEIVER = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as Address;

describe("1delta SDK Basic Tests", () => {
  test("isETH should correctly identify ETH addresses", () => {
    expect(isETH("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address)).toBe(
      true
    );
    expect(isETH("0x0000000000000000000000000000000000000000" as Address)).toBe(
      true
    );
    expect(isETH("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address)).toBe(
      false
    );
  });

  test("getAaveV3PoolAddress should return the correct pool address", () => {
    const poolAddress = getAaveV3PoolAddress(1);
    expect(poolAddress).toBe("0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2");
  });

  test("getCompoundComptrollerAddress should return the correct comptroller address", () => {
    const comptrollerAddress = getCompoundComptrollerAddress(1);
    expect(comptrollerAddress).toBe(
      "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
    );
  });

  test("createFlashLoanCall should create valid calldata for Aave V3", () => {
    const token = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address;
    const amount = 1000000000n;
    const receiver = TEST_RECEIVER;
    const chainId = 1;

    const expectedCallData = encodeFunctionData({
      abi: AAVE_V3_POOL_ABI,
      functionName: "flashLoanSimple",
      args: [
        receiver,
        token,
        amount,
        "0x", // userData
        0, // referralCode
      ],
    });

    const result = createFlashLoanCall({
      token,
      amount,
      receiver,
      chainId,
    });

    expect(result.to).toBe("0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2");
    expect(result.value).toBe(0n);
    expect(result.data).toBe(expectedCallData);
  });

  test("createEnterMarketsCall should create valid calldata for Compound", () => {
    const markets = [
      "0x39AA39c021dfbaE8faC545936693aC917d5E7563" as Address, // cUSDC
      "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5" as Address, // cETH
    ];
    const chainId = 1;

    const expectedCallData = encodeFunctionData({
      abi: COMPTROLLER_ABI,
      functionName: "enterMarkets",
      args: [markets],
    });

    const result = compoundCreateEnterMarketsCall(chainId, markets);

    expect(result.to).toBe("0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B");
    expect(result.value).toBe(0n);
    expect(result.data).toBe(expectedCallData);
  });
});
