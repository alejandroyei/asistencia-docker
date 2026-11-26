import type { Registration } from "./Registration";

export interface RegistrationPort{
    createRegistration(registration: Omit<Registration, "id">): Promise<number>;
    getRegistrationById(id:number):Promise<Registration | null>;
    getRegistrationsByUser(id:number):Promise<Registration[] | null>;
    getRegistrationsByGroups(id:number):Promise<Registration[] | null>;
    getAllRegistrations(): Promise<Registration[]>;
}
