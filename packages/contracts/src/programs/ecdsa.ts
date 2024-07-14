import {
  Bool,
  createForeignCurveV2,
  ZkProgram,
  Crypto,
  createEcdsaV2,
  Bytes,
} from "o1js";

// TODO: Adjust to secp256r1
class Secp256k1 extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) {}
class Ecdsa extends createEcdsaV2(Secp256k1) {}
class Bytes32 extends Bytes(32) {}

export const ecdsa = ZkProgram({
  name: "ecdsa",
  publicInput: Bytes32.provable,
  publicOutput: Bool,

  methods: {
    verifyEcdsa: {
      privateInputs: [Ecdsa.provable, Secp256k1.provable],
      async method(message: Bytes32, signature: Ecdsa, publicKey: Secp256k1) {
        return signature.verifyV2(message, publicKey);
      },
    },
  },
});
