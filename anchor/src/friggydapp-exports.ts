// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Friggydapp } from '../target/types/friggydapp';
import { IDL as FriggydappIDL } from '../target/types/friggydapp';

// Re-export the generated IDL and type
export { Friggydapp, FriggydappIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const FRIGGYDAPP_PROGRAM_ID = new PublicKey(
  'F5HCKquEqLo7wirBB9NNfwFqMC7Rc6yhmRJnVRN7mWKm'
);

// This is a helper function to get the program ID for the Friggydapp program depending on the cluster.
export function getFriggydappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return FRIGGYDAPP_PROGRAM_ID;
  }
}
