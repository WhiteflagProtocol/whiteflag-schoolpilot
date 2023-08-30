import { User, WhiteflagUser } from "./User";
import { WhiteflagSignal } from "./WhiteflagSignal";

export class DecodedSignal {
  public id: number;
  public tx_hash: any;
  public timestamp: string;
  public mempool_timestamp: string;
  public signal_text: WhiteflagSignal;
  public sender: WhiteflagUser;
  public synced: boolean;
  public confirmations: string[];
}
