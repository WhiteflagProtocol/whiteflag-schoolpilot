import { User } from "./User";

export class WhiteflagSignal {
  public encryptionIndicator: EncryptionIndicator =
    EncryptionIndicator.noEncryption;
  public duressIndicator: "0" | "1" = "1";
  public messageCode: MessageCode;
  public referenceIndicator: ReferenceIndicator;
  public referencedMessage: string =
    "0000000000000000000000000000000000000000000000000000000000000000";
  public verificationMethod?: string; // "1"
  public verificationData?: string; // "https://organisation.int/whiteflag"
  public cryptoDataType: string; // "0"
  public cryptoData?: string;
  public text?: string;
  public resourceMethod?: string;
  public resourceData?: string;
  public pseudoMessageCode?: string;
  public subjectCode: InfrastructureSubjectCode =
    InfrastructureSubjectCode.Unspecified;
  public datetime?: string; // YYYY-MM-DDThh:mm:ssZ
  public duration?: string; // P00D00H00M
  public objectType?: string;
  public objectLatitude?: string;
  public objectLongitude?: string;
  public objectSizeDim1?: string;
  public objectSizeDim2?: string;
  public objectOrientation?: string;
  public objectTypeQuant?: string;

  public constructor(
    encryptionIndicator: EncryptionIndicator,
    duressIndicator: "0" | "1",
    messageCode: MessageCode,
    referenceIndicator: ReferenceIndicator,
    referencedMessage: string,
    subjectCode: InfrastructureSubjectCode,
    datetime: string,
    duration: string,
    objectType: string,
    objectLatitude: string,
    objectLongitude: string,
    objectSizeDim1: string,
    objectSizeDim2: string,
    objectOrientation: string
  ) {
    this.encryptionIndicator = encryptionIndicator;
    this.duressIndicator = duressIndicator;
    this.messageCode = messageCode;
    this.referenceIndicator = referenceIndicator;
    this.referencedMessage = referencedMessage;
    this.subjectCode = subjectCode;
    this.datetime = datetime;
    this.duration = duration;
    this.objectType = objectType;
    this.objectLatitude = objectLatitude;
    this.objectLongitude = objectLongitude;
    this.objectSizeDim1 = objectSizeDim1;
    this.objectSizeDim2 = objectSizeDim2;
    this.objectOrientation = objectOrientation;
  }
}

export enum EncryptionIndicator {
  noEncryption = "0",
  aes256ctrEcdh = "1",
  aes256ctrPsk = "2",
}

export enum MessageCode {
  Infrastructure = "I",
}

export enum ReferenceIndicator {
  Original = "0",
  Recall = "1",
  Update = "2",
  Add = "3",
  Discontinue = "4",
  Relate = "5",
  Confirm = "6",
  Acknowledge = "7",
  Comply = "8",
  Reject = "9",
}

export enum InfrastructureSubjectCode {
  Unspecified = "00",
  Hospital = "51",
  School = "52",
}

export class WhiteflagResponse {
  public id: number;
  public txHash?: string;
  public timestamp: string;
  public mempool_timestamp?: string;
  public signal_text: string;
  public signal_body: WhiteflagSignal;
  public sender: User;
  public sender_group: string;
  public synced: boolean;
  public confirmationss: string[];
}
