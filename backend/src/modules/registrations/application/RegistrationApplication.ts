import type { Registration } from "../domain/Registration";
import type { RegistrationPort } from "../domain/RegistrationPort";

export class RegistrationApplication{
    private port: RegistrationPort;

    constructor(port: RegistrationPort){
        this.port = port;
    }

    async createRegistration(registration: Omit<Registration, "id">): Promise<number> {
        const existing = await this.port.getRegistrationsByUser(registration.users);
        if (existing?.some((entry) => entry.groups === registration.groups && entry.status === 1)) {
            throw new Error("El usuario ya está inscrito en este grupo");
        }
        return this.port.createRegistration(registration);
    }

    async getRegistrationById(id:number):Promise<Registration | null>{
        return await this.port.getRegistrationById(id);
    }

    async getRegistrationsByUser(id:number):Promise<Registration[] | null>{
        return await this.port.getRegistrationsByUser(id);
    }

    async getRegistrationByGroups(id: number): Promise<Registration[] | null> {
        return await this.port.getRegistrationsByGroups(id);
    }

    async getAllRegistrations():Promise<Registration[]>{
        return await this.port.getAllRegistrations();
    }

    // async updateRegistration(id:number, user: Partial<User>): Promise<boolean>{
    //     const existingUser = await this.port.getUserById(id);
    //     if(!existingUser){
    //         throw new Error("Usuario no encontrado")
    //     }
    //     if (user.email){
    //         const emailTaken = await this.port.getUserByEmail(user.email);
    //         if (emailTaken && emailTaken.id !== id){
    //             throw new Error("El email ya está en uso");
    //         }
    //     }
    //     return this.port.updateUser(id, user);
    // }

    // async deleteRegistration(id:number): Promise<boolean>{
    //     return await this.port.deleteUser(id);
    // }
}
