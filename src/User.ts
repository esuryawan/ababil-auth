export interface User {
   Id: number;
   UserName: string;
   UserKind: number;
   Email: string;

   AccessToken?: string;
   Picture?: string;
   ExpiredAt?: Date;

   Roles?: string[];
}
