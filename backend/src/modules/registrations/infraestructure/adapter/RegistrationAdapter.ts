import type { Repository } from "typeorm";
import type { Registration as RegistrationDomain} from "../../domain/Registration";
import type { RegistrationPort } from "../../domain/RegistrationPort";
import {Registration as RegistrationEntity} from "../entities/Registration"
import { AppDataSource } from "../../../../shared/config/data-base";
import { User } from "../../../users/infraestructure/entities/User";
import { Group } from "../../../groups/infraestructure/entities/Group";

export class RegistrationAdapter implements RegistrationPort{

    private registrationRepository: Repository<RegistrationEntity>

    constructor(){
        this.registrationRepository = AppDataSource.getRepository(RegistrationEntity);
    }

    private toDomain(registration: RegistrationEntity): RegistrationDomain{
        return{
            id: registration.id_registrations,
            users: registration.User?.id,
            groups: registration.Groups?.id_group,
            status: registration.status_registrations
        }
    }

    private toEntity(registration: Omit<RegistrationDomain, "id">):RegistrationEntity{
        const registrationEntity = new RegistrationEntity();
        registrationEntity.Groups = { id_group: registration.groups } as Group;
        registrationEntity.User = { id: registration.users } as User;
        registrationEntity.status_registrations = registration.status;
        return registrationEntity;
    }

    async createRegistration(registration: Omit<RegistrationDomain, "id">): Promise<number> {
        const created = await this.registrationRepository.save(this.toEntity(registration));
        return created.id_registrations;
    }

    async getRegistrationById(id: number): Promise<RegistrationDomain | null> {
        try {
            const user = await this.registrationRepository.findOne({where: {id_registrations : id}, relations: {Groups:true, User:true} });
            return user ? this.toDomain(user) : null;
        } catch (error) {
            console.log("Error obteniendo inscripción por id", error)
            throw new Error("Error obteniendo inscripción ")
        }
    }

    async getRegistrationsByGroups(groups: number): Promise<RegistrationDomain[] | null> {
        try {
            const registration = await this.registrationRepository.find({ where: { Groups:{id_group: groups}}, relations: {Groups:true, User:true} });
            return registration.map(this.toDomain);
        } catch (error) {
            console.log("Error obteniendo inscripciones por grupos", error);
                throw new Error("Error obteniendo inscripciones por grupos");
        }
    }

    async getRegistrationsByUser(id: number): Promise<RegistrationDomain[] | null> {
        try {
            const registration = await this.registrationRepository.find({ where: {User:{id: id}}, relations: {Groups:true, User:true} });
            return registration.map(this.toDomain);
        } catch (error) {
            console.log("Error obteniendo inscripciones por usuario", error);
                throw new Error("Error obteniendo inscripciones por usuario");
        }
    }

    async getAllRegistrations(): Promise<RegistrationDomain[]> {
        try {
            const registration = await this.registrationRepository.find({where : {status_registrations:1},  relations: {Groups:true, User:true}});
            return registration.map(this.toDomain);
        } catch (error) {
            console.log("Error obteniendo usuarios", error)
            throw new Error("Error obteniendo lista de usuarios")
        }
    }

}
