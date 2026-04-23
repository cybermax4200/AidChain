import {
  Keypair,
  Networks,
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Claimant,
  BASE_FEE,
} from '@stellar/stellar-sdk';

const HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
const USDC_ISSUER = process.env.USDC_ISSUER!;

const server = new Horizon.Server(HORIZON_URL);
const USDC = new Asset('USDC', USDC_ISSUER);

export const createClaimableBalance = async (
  sourceSecret: string,
  beneficiaryPublicKey: string,
  amount: string,
  unlockTimestamp: string
) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const claimants = [
    new Claimant(
      beneficiaryPublicKey,
      Claimant.predicateNot(Claimant.predicateBeforeAbsoluteTime(unlockTimestamp))
    ),
    new Claimant(
      sourceKeypair.publicKey(),
      Claimant.predicateBeforeRelativeTime('7776000') // 90 days
    ),
  ];

  const tx = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.createClaimableBalance({ asset: USDC, amount, claimants }))
    .setTimeout(30)
    .build();

  tx.sign(sourceKeypair);
  return await server.submitTransaction(tx);
};

export const getAccountBalances = async (publicKey: string) => {
  const account = await server.loadAccount(publicKey);
  return account.balances;
};

export const claimBalance = async (
  sourceSecret: string,
  balanceId: string
) => {
  // TODO: implement claim operation
  throw new Error("Not implemented");
};

// TODO: claimBalance(sourceSecret, balanceId) - claim a claimable balance
// TODO: createAccount(sourceSecret, newPublicKey) - fund a new account
// TODO: trustAsset(sourceSecret, assetCode, issuer) - establish trustline

export { server, NETWORK_PASSPHRASE };
