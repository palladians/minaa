import { Group, SmartContract, State, method, state } from "o1js"

export class Ownable extends SmartContract {
  // Represented as X, Y of ECDSA curve
  @state(Group) publicKey = State<Group>()

  @method
  async transferOwnership(newOwner: Group) {
    this.publicKey.getAndRequireEquals()
    this.publicKey.set(newOwner)
  }
}
