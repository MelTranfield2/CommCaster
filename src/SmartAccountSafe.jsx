import { signerToSafeSmartAccount } from "permissionless/accounts";
import { createPublicClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";

import { sepolia } from "viem/chains";
import { smartAccountSigner } from "./SmartAccountSigner.jsx";
import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
} from "permissionless";

const apiKey = "c9915ca1-57c0-4b11-919d-2f398644c95e";
const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
  chain: sepolia,
});

export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V06,
});

const bundlerClient = createPimlicoBundlerClient({
  transport: http(paymasterUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V06,
});

const smartAccount = await signerToSafeSmartAccount(publicClient, {
  signer: smartAccountSigner,
  safeVersion: "1.4.1",
  entryPoint: ENTRYPOINT_ADDRESS_V06,
});

const smartAccountClient = createSmartAccountClient({
  account: smartAccount,
  entryPoint: ENTRYPOINT_ADDRESS_V06,
  chain: sepolia,
  bundlerTransport: http(paymasterUrl),
  middleware: {
    gasPrice: async () => {
      return (await bundlerClient.getUserOperationGasPrice()).fast; // if using pimlico bundlers
    },
    sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
  },
});

export async function makeTransaction() {
  const txHash = await smartAccountClient.sendTransaction({
    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    value: 0n,
    data: "0x1234",
  });
  console.log(txHash);
}
