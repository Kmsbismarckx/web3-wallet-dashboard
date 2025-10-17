import { useAccount } from "wagmi";
import { Account } from "./Account";
import { WalletOptions } from "./WalletOptions";

const Wallet = () => {
  const { isConnected } = useAccount();

  return <div>{isConnected ? <Account /> : <WalletOptions />}</div>;
};

export default Wallet;
