import { WhiteflagUser } from "./User";
import { WhiteflagSignal } from "./WhiteflagSignal";

export class DecodedSignal {
  public id: number;
  public tx_hash: any;
  public timestamp: string;
  public mempool_timestamp: string;
  public signal_text: string;
  public signal_body: WhiteflagSignal;
  public sender: WhiteflagUser;
  public references: DecodedSignal[];
  public synced: boolean;
  public confirmations: string[];
}
