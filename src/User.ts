export interface User {
   Id: number;
   Name?: string;
   Login: string;
   Kind: number;
   Email?: string;
   AccessToken?: string;
   Picture?: string;
   ExpiredAt: Date;
   Roles: string[];
}

export function hasRole(user: User, role: string) {
   if (user.Roles) {
      for (let i = 0; i < user.Roles.length; i++) {
         const element = user.Roles[i];
         if (element === role) {
            return true;
         }
      }
   }
   return false;
}
