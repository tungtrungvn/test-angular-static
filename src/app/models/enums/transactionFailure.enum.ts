export enum ETransactionFailureExplanation {
    RETRIEVE1 = 'Retrieve #1',
    RETRIEVE2 = 'Retrieve #2',
}
export const transactionFailureExplanation: any = {
    RETRIEVE1: ETransactionFailureExplanation.RETRIEVE1,
    RETRIEVE2: ETransactionFailureExplanation.RETRIEVE2,
}

export enum ETransactionFailureType {
    ADDFUND = 'Add Fund',
    FUND = 'Fund',
    CASHOUT = 'Cash Out',
}
