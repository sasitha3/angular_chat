import { Role } from "./role";

export class User {
    id           : string;
    name         : string;
    username     : string;
    token        : string;
    role         : Role;
}