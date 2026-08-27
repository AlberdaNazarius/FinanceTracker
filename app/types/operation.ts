import {OperationKind} from "@/enum/operation-kind";
import {ResponseTransaction} from "@/types/response/response-transaction";
import {ResponseTransfer} from "@/types/transfer";

export type Operation =
  | {kind: OperationKind.TRANSACTION; id: string; date: string; transaction: ResponseTransaction}
  | {kind: OperationKind.TRANSFER; id: string; date: string; transfer: ResponseTransfer};
