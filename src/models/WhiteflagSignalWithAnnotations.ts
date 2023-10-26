import { SignalBodyText } from "./SignalBodyText";
import { WhiteflagSignal } from "./WhiteflagSignal";

export class WhiteflagSignalWithAnnotations {
  public signal_body: WhiteflagSignal;
  public annotations: string;
  public recipient_group: string;

  constructor(
    signal_body: WhiteflagSignal,
    annotations: SignalBodyText,
    recipientGroup: string
  ) {
    this.signal_body = signal_body;
    this.annotations = JSON.stringify(annotations);
    this.recipient_group = recipientGroup;
  }
}
