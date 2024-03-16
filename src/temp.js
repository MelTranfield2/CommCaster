import "dotenv/config";
import { getAccountNonce, createSmartAccountClient } from "permissionless";
import {
  UserOperation,
  bundlerActions,
  getSenderAddress,
  getUserOperationHash,
  waitForUserOperationReceipt,
  GetUserOperationReceiptReturnType,
  signUserOperationHashWithECDSA,
} from "permissionless";
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
} from "permissionless/actions/pimlico";
import {
  Address,
  Hash,
  concat,
  createClient,
  createPublicClient,
  encodeFunctionData,
  http,
  Hex,
} from "viem";
import {
  generatePrivateKey,
  privateKeyToAccount,
  signMessage,
} from "viem/accounts";
import { lineaTestnet, polygonMumbai, sepolia } from "viem/chains";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import {
  privateKeyToSimpleSmartAccount,
  privateKeyToSafeSmartAccount,
} from "permissionless/accounts";
import { writeFileSync } from "fs";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";

console.log("Hello world!");

const apiKey = "c9915ca1-57c0-4b11-919d-2f398644c95e";
const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

export const publicClient = createPublicClient({
  transport: http("https://rpc.ankr.com/eth_sepolia"),
});

export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});