import {
  Bool,
  Crypto,
  ZkProgram,
  createEcdsaV2,
  createForeignCurveV2,
} from "o1js";

// TODO: Adjust to secp256r1
export class Secp256k1 extends createForeignCurveV2(
  Crypto.CurveParams.Secp256k1,
) {}
export class Secp256k1Scalar extends Secp256k1.Scalar {}
export class Secp256k1Signature extends createEcdsaV2(Secp256k1) {}

export const ecdsaProgram = ZkProgram({
  name: "ecdsa",
  publicOutput: Bool,
  methods: {
    verifyEcdsa: {
      privateInputs: [
        Secp256k1Scalar.provable,
        Secp256k1Signature.provable,
        Secp256k1.provable,
      ],
      async method(
        message: Secp256k1Scalar,
        signature: Secp256k1Signature,
        publicKey: Secp256k1,
      ) {
        return signature.verifySignedHashV2(message, publicKey);
      },
    },
  },
});

export type EcdsaProgram = typeof ecdsaProgram;
