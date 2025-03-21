export const CTOKEN_ABI = [
  // mint
  {
    constant: false,
    inputs: [{ name: "mintAmount", type: "uint256" }],
    name: "mint",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  // mint for ETH (cETH)
  {
    constant: false,
    inputs: [],
    name: "mint",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  // redeem cTokens
  {
    constant: false,
    inputs: [{ name: "redeemTokens", type: "uint256" }],
    name: "redeem",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  // redeem underlying
  {
    constant: false,
    inputs: [{ name: "redeemAmount", type: "uint256" }],
    name: "redeemUnderlying",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  // borrow
  {
    constant: false,
    inputs: [{ name: "borrowAmount", type: "uint256" }],
    name: "borrow",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  // repay borrow
  {
    constant: false,
    inputs: [{ name: "repayAmount", type: "uint256" }],
    name: "repayBorrow",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  // repay borrow behalf
  {
    constant: false,
    inputs: [
      { name: "borrower", type: "address" },
      { name: "repayAmount", type: "uint256" },
    ],
    name: "repayBorrowBehalf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Comptroller ABI
export const COMPTROLLER_ABI = [
  {
    constant: false,
    inputs: [{ name: "cTokens", type: "address[]" }],
    name: "enterMarkets",
    outputs: [{ name: "", type: "uint256[]" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "cTokenAddress", type: "address" }],
    name: "exitMarket",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
