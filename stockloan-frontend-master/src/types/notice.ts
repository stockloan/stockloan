export interface INotice {
  id: number;
  attributes: {
    CNTNT: string;
    NTC_TYP: string;
    TTL: string;
    createdAt: Date;
    publishedAt: Date;
    updatedAt: Date;
  };
}

export interface INoticeBoard {
  current: INotice;
  prev?: INotice;
  next?: INotice;
}
