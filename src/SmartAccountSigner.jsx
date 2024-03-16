import { OAuthExtension } from "@magic-ext/oauth";
import { Magic as MagicBase } from "magic-sdk";
import { providerToSmartAccountSigner } from "permissionless";

const magic = new MagicBase("pk_live_6CF8A6EED4D14062", {
  network: {
    rpcUrl: "https://rpc.ankr.com/eth_sepolia",
    chainId: 11155111,
  },
  extensions: [new OAuthExtension()],
});

// Get the Provider from Magic and convert it to a SmartAccountSigner
const magicProvider = await magic.wallet.getProvider();
export const smartAccountSigner = await providerToSmartAccountSigner(
  magicProvider
);
