export const AAVE_V3_POOL_ABI = [
  {
    inputs: [
      { name: "receiverAddress", type: "address" },
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "params", type: "bytes" },
      { name: "referralCode", type: "uint16" },
    ],
    name: "flashLoanSimple",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "receiverAddress", type: "address" },
      { name: "assets", type: "address[]" },
      { name: "amounts", type: "uint256[]" },
      { name: "modes", type: "uint256[]" },
      { name: "onBehalfOf", type: "address" },
      { name: "params", type: "bytes" },
      { name: "referralCode", type: "uint16" },
    ],
    name: "flashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
