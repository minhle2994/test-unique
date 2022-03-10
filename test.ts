import { ApiPromise, WsProvider } from "@polkadot/api";
import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { u8aToHex } from '@polkadot/util';

async function main() {
  const wsProvider = new WsProvider('wss://testnet2.uniquenetwork.io');
  const defs = require('@unique-nft/types/definitions');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    rpc: { unique: defs.unique.rpc }
  });
  await api.isReadyOrError;

  const testingPair = createTestPairs();
  // console.log(testingPair);

  const fromAddress = testingPair.alice.address;
  const toAddress = "5FhGVTrsw6ufJFGABtHd8efNbq4AQx99aCCK4MvfcdcfRQ9n";

  const beforeAccountData = await api.query.system.account(fromAddress);
  console.log(beforeAccountData.toHuman());

  // const hash = await api.tx.balances
  //   .transfer(
  //     toAddress,
  //     "90000000000000000"
  //   )
  //   .signAndSend(testingPair.alice);
  // console.log(hash.toHex())
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });