import {
  Secp256k1,
  Secp256k1Scalar,
  Secp256k1Signature,
  ecdsaProgram,
} from "./ecdsa";

const privateKey = Secp256k1Scalar.random();
const publicKey = Secp256k1.generator.scale(privateKey);
const message = Secp256k1Scalar.from("what's up");
// const signature = Ecdsa.sign(message.toBytes(), privateKey.toBigInt());
const signature = Secp256k1Signature.signHash(
  message.toBigInt(),
  privateKey.toBigInt(),
);

describe("ECDSA", () => {
  it("verifies ECDSA", async () => {
    await ecdsaProgram.compile();
    const proof = await ecdsaProgram.verifyEcdsa(message, signature, publicKey);
    expect(proof.publicOutput).toEqual(true);
  }, 1_000_000);
});
