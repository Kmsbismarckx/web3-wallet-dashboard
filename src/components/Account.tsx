import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { SendTransaction } from "./SendTransaction";
import styled from "styled-components";
import ReadContract from "./ReadContract";

const AccountContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
`;

const AccountHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const AccountInfo = styled.div`
  flex: 1;
`;

const AccountName = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const AccountAddress = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  word-break: break-all;
`;

const DisconnectButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <MainContent>
      <AccountContainer>
        <AccountHeader>
          {ensAvatar && <Avatar alt="ENS Avatar" src={ensAvatar} />}
          <AccountInfo>
            {ensName ? (
              <AccountName>{ensName}</AccountName>
            ) : (
              <AccountName>Unknown User</AccountName>
            )}
            {address && <AccountAddress>{address}</AccountAddress>}
            <ReadContract />
          </AccountInfo>
          <DisconnectButton onClick={() => disconnect()}>
            Disconnect
          </DisconnectButton>
        </AccountHeader>
      </AccountContainer>
      <SendTransaction />
    </MainContent>
  );
}
