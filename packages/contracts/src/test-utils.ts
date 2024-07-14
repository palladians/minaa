import {
  AccountUpdate,
  Lightnet,
  Mina,
  type PrivateKey,
  fetchAccount,
} from "o1js"

export const initLightnet = async () => {
  const network = Mina.Network({
    mina: "http://localhost:8080/graphql",
    archive: "http://localhost:8282",
    lightnetAccountManager: "http://localhost:8181",
  })
  Mina.setActiveInstance(network)
  const senderPrivateKey = (await Lightnet.acquireKeyPair()).privateKey
  const senderAddress = senderPrivateKey.toPublicKey()

  const zkAppPrivateKey = (await Lightnet.acquireKeyPair()).privateKey
  const zkAppAddress = zkAppPrivateKey.toPublicKey()

  return {
    senderPrivateKey,
    senderAddress,
    zkAppPrivateKey,
    zkAppAddress,
  }
}

export const ensureFundedAccount = async (privateKey: PrivateKey) => {
  const publicKey = privateKey.toPublicKey()
  const result = await fetchAccount({ publicKey })
  const balance = result.account?.balance.toBigInt()
  if (!balance || balance <= 15_000_000_000n) {
    AccountUpdate.fundNewAccount(publicKey, 2)
  }
  return { privateKey, publicKey }
}
