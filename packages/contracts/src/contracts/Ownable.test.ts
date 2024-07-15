import {
  Group,
  Lightnet,
  Mina,
  type PrivateKey,
  type PublicKey,
  type VerificationKey,
} from "o1js"
import { ensureFundedAccount, initLightnet } from "../test-utils"
import { Ownable } from "./Ownable"

const FEE = 100_000_000

describe("Ownable", () => {
  let senderAddress: PublicKey
  let senderPrivateKey: PrivateKey
  let zkAppAddress: PublicKey
  let zkAppPrivateKey: PrivateKey
  let zkApp: Ownable
  let verificationKey: VerificationKey

  beforeEach(async () => {
    const lightnet = await initLightnet()
    senderPrivateKey = lightnet.senderPrivateKey
    senderAddress = lightnet.senderAddress
    zkAppPrivateKey = lightnet.zkAppPrivateKey
    zkAppAddress = lightnet.zkAppAddress
    zkApp = new Ownable(zkAppAddress)
    await ensureFundedAccount(zkAppPrivateKey)
  })

  beforeAll(async () => {
    verificationKey = (await Ownable.compile()).verificationKey
  })

  afterAll(async () => {
    await Lightnet.releaseKeyPair({
      publicKey: senderPrivateKey.toBase58(),
    })
  })

  async function localDeploy() {
    const txn = await Mina.transaction(
      { sender: senderAddress, fee: FEE },
      async () => {
        await ensureFundedAccount(senderPrivateKey)
        await zkApp.deploy({ verificationKey })
      },
    )
    await txn.prove()
    await txn.sign([senderPrivateKey, zkAppPrivateKey]).send()
  }

  it("generates and deploys the `Ownable` smart contract", async () => {
    await localDeploy()
    const owner = zkApp.publicKey.get()
    expect(owner).toEqual(Group.from(0, 0))
  })

  it("transfers the ownership to different public key", async () => {
    await localDeploy()
    const txn = await Mina.transaction(
      { sender: senderAddress, fee: FEE },
      async () => {
        await zkApp.transferOwnership(Group.from(-1, 2))
      },
    )
    await txn.prove()
    await txn.sign([senderPrivateKey]).send()
    const owner = zkApp.publicKey.get()
    expect(owner).toEqual(Group.from(-1, 2))
  })
})
