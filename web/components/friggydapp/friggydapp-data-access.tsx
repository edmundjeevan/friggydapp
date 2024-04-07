'use client';

import { FriggydappIDL, getFriggydappProgramId } from '@friggydapp/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useFriggydappProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getFriggydappProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(FriggydappIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['friggydapp', 'all', { cluster }],
    queryFn: () => program.account.friggydapp.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['friggydapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ friggydapp: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useFriggydappProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useFriggydappProgram();

  const accountQuery = useQuery({
    queryKey: ['friggydapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.friggydapp.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['friggydapp', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ friggydapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['friggydapp', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ friggydapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['friggydapp', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ friggydapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['friggydapp', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ friggydapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
