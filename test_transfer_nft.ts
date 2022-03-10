import { ApiPromise, WsProvider } from "@polkadot/api";
import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { Keyring } from '@polkadot/keyring';

const test1Mnemonic = 'start print thing cart puppy virus crystal hire level bottom gap garbage'
const test2Mnemonic = 'nephew ten camera assist six apology fix shuffle keen century ugly sweet'
const collectionId = 1802

const delay = (ms: number) => {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  const wsProvider = new WsProvider('wss://ws-opal.unique.network');
  const defs = require('@unique-nft/types/definitions');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    rpc: { unique: defs.unique.rpc }
  });
  await api.isReadyOrError;

  const keyring = new Keyring({ type: 'sr25519'});
  const pair1 = keyring.addFromUri(test1Mnemonic, { name: 'test1' }, 'sr25519');
  const pair2 = keyring.addFromUri(test2Mnemonic, { name: 'test2' }, 'sr25519');

  console.log('test1 address:', pair1.address)
  // @ts-ignore
  let test1Assets = (await api.rpc.unique.accountTokens(collectionId, { Substrate: pair1.address })).toJSON();
  console.log('test1 address nft:', test1Assets)

  console.log('test2 address:', pair2.address)
    // @ts-ignore
  let test2Assets = (await api.rpc.unique.accountTokens(collectionId, { Substrate: pair2.address })).toJSON();
  console.log('test2 address nft:', test2Assets)


  // use api.tx.unique.transfer for quartz | api.tx.nft.transfer for unique
  console.log('Sending NFT')
  const hash = await api.tx.unique
    .transfer(
      { Substrate: pair1.address },
      collectionId,
      test2Assets[0],
      1
    )
    .signAndSend(pair2);
  console.log("NFT sent with hash", hash.toHex());
  await delay(30000);

  // @ts-ignore
  test1Assets = (await api.rpc.unique.accountTokens(collectionId, { Substrate: pair1.address })).toJSON();
  console.log('test1 address nft:', test1Assets)
  // @ts-ignore
  test2Assets = (await api.rpc.unique.accountTokens(collectionId, { Substrate: pair2.address })).toJSON();
  console.log('test2 address nft:', test2Assets)
}


main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });