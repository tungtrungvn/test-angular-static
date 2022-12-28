
export interface IPagination {
    limit: number;
    skip: number;
}

export interface IScrollResponse<T> {
    items: T[];
    hasMore: boolean;
}

export interface TimeSpan {
    hours: number;
    minutes: number;
    seconds: number;
}
export interface IPopupInfo {
    headerText: string;
    content: string;
    btnCancelText: string;
    btnOkText: string;
}
