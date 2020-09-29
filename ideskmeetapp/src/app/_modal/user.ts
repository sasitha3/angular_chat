import { Role } from "./role";

export class User {
    id           : string;
    first_name   : string;
    last_name    : string;
    image        : string;
    username     : string;
    email        : string;
    access_token : string;
    mobile       : string;
    role         : Role;
}