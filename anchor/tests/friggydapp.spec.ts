import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Friggydapp } from '../target/types/friggydapp';

describe('friggydapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Friggydapp as Program<Friggydapp>;

  const friggydappKeypair = Keypair.generate();

  it('Initialize Friggydapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        friggydapp: friggydappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([friggydappKeypair])
      .rpc();

    const currentCount = await program.account.friggydapp.fetch(
      friggydappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Friggydapp', async () => {
    await program.methods
      .increment()
      .accounts({ friggydapp: friggydappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.friggydapp.fetch(
      friggydappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Friggydapp Again', async () => {
    await program.methods
      .increment()
      .accounts({ friggydapp: friggydappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.friggydapp.fetch(
      friggydappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Friggydapp', async () => {
    await program.methods
      .decrement()
      .accounts({ friggydapp: friggydappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.friggydapp.fetch(
      friggydappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set friggydapp value', async () => {
    await program.methods
      .set(42)
      .accounts({ friggydapp: friggydappKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.friggydapp.fetch(
      friggydappKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the friggydapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        friggydapp: friggydappKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.friggydapp.fetchNullable(
      friggydappKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
