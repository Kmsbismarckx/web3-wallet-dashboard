import { BaseError, useReadContract, useReadContracts } from "wagmi";

export const wagmiContractConfig = {
  address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
  abi: [
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ type: "uint256" }],
    },
    {
      type: "function",
      name: "totalSupply",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "supply", type: "uint256" }],
    },
  ],
} as const;

function ReadContract() {
  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        ...wagmiContractConfig,
        functionName: "balanceOf",
        args: ["0x03A71968491d55603FFe1b11A9e23eF013f75bCF"],
      },
    ],
  });
  const [balance] = data || [];

  if (isPending) return <div>Loading...</div>;

  if (error)
    return (
      <div>Error: {(error as BaseError).shortMessage || error.message}</div>
    );

  return (
    <>
      <div>Balance: {balance?.result?.toString()}</div>
    </>
  );
}

export default ReadContract;
