import { parseEther } from "viem";
import {
  BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import styled from "styled-components";

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #888;
  }
`;

const Button = styled.button<{ $isPending?: boolean }>`
  padding: 1rem 2rem;
  background: ${(props) =>
    props.$isPending
      ? "linear-gradient(135deg, #ffa726 0%, #ff7043 100%)"
      : "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${(props) => (props.$isPending ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const StatusMessage = styled.div<{
  $type: "hash" | "confirming" | "confirmed" | "error";
}>`
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  font-weight: 500;

  ${(props) => {
    switch (props.$type) {
      case "hash":
        return `
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid rgba(33, 150, 243, 0.3);
          color: #2196F3;
        `;
      case "confirming":
        return `
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          color: #FFC107;
        `;
      case "confirmed":
        return `
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4CAF50;
        `;
      case "error":
        return `
          background: rgba(244, 67, 54, 0.1);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #F44336;
        `;
      default:
        return "";
    }
  }}
`;

const HashText = styled.span`
  word-break: break-all;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9rem;
`;

export function SendTransaction() {
  const {
    data: hash,
    isPending,
    error,
    sendTransaction,
  } = useSendTransaction();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get("address") as `0x${string}`;
    const value = formData.get("value") as string;
    sendTransaction({ to, value: parseEther(value) });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <Container>
      <Title>Send Transaction</Title>
      <Form onSubmit={submit}>
        <InputGroup>
          <Label htmlFor="address">Recipient Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="0xA0Cf…251e"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="value">Amount (ETH)</Label>
          <Input
            id="value"
            name="value"
            placeholder="0.05"
            type="number"
            step="0.001"
            min="0"
            required
          />
        </InputGroup>

        <Button type="submit" disabled={isPending} $isPending={isPending}>
          {isPending ? "Confirming..." : "Send Transaction"}
        </Button>

        {hash && (
          <StatusMessage $type="hash">
            <strong>Transaction Hash:</strong>
            <br />
            <HashText>{hash}</HashText>
          </StatusMessage>
        )}

        {isConfirming && (
          <StatusMessage $type="confirming">
            ⏳ Waiting for confirmation...
          </StatusMessage>
        )}

        {isConfirmed && (
          <StatusMessage $type="confirmed">
            ✅ Transaction confirmed successfully!
          </StatusMessage>
        )}

        {error && (
          <StatusMessage $type="error">
            <strong>Error:</strong>
            <br />
            {(error as BaseError).shortMessage || error.message}
          </StatusMessage>
        )}
      </Form>
    </Container>
  );
}
