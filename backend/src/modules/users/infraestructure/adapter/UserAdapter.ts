import type { Repository } from "typeorm";
import type { User as UserDomain } from "../../domain/User";
import type { UserPort } from "../../domain/UserPort";
import { User as UserEntity } from "../entities/User";
import { AppDataSource } from "../../../../shared/config/data-base";
import { Programs } from "../../../programs/infraestructure/entities/Programs";

export class UserAdapter implements UserPort {
    private readonly userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }

    private toDomain(user: UserEntity): UserDomain {
        const programId = user.Program?.id ?? 0;
        return {
            user_id: user.id,
            user_first_name: user.first_name,
            user_last_name: user.last_name,
            user_email: user.email,
            user_password: user.password ?? "",
            user_microsoft_id: user.microsoft_id ?? "",
            user_auth_provider: user.auth_provider,
            user_job_title: user.job_title ?? "",
            user_department: user.department ?? "",
            user_office_location: user.office_location ?? "",
            user_mobile_phone: user.mobile_phone ?? "",
            user_business_phones: user.business_phones ?? "",
            user_permissions: user.permissions ?? {} as JSON,
            user_role_id: user.role_id,
            user_program_id: programId,
            user_status_id: user.status_id,
            user_created_at: user.created_at,
            Programs: user.Program ?? ({ id: programId, name: "" } as Programs),
        };
    }

    private toEntity(user: Omit<UserDomain, "user_id">): UserEntity {
        const programId = user.user_program_id || user.Programs?.id;
        if (!programId) throw new Error("El programa del usuario es obligatorio");

        const entity = new UserEntity();
        entity.first_name = user.user_first_name;
        entity.last_name = user.user_last_name;
        entity.email = user.user_email;
        entity.password = user.user_password;
        entity.microsoft_id = user.user_microsoft_id || null as unknown as string;
        entity.auth_provider = user.user_auth_provider || "local";
        entity.job_title = user.user_job_title || null as unknown as string;
        entity.department = user.user_department || null as unknown as string;
        entity.office_location = user.user_office_location || null as unknown as string;
        entity.mobile_phone = user.user_mobile_phone || null as unknown as string;
        entity.business_phones = user.user_business_phones || null as unknown as string;
        entity.permissions = user.user_permissions ?? null as unknown as JSON;
        entity.role_id = user.user_role_id;
        entity.Program = { id: programId } as Programs;
        entity.status_id = user.user_status_id;
        entity.created_at = user.user_created_at ?? new Date();
        return entity;
    }

    async createUser(user: Omit<UserDomain, "user_id">): Promise<number> {
        const savedUser = await this.userRepository.save(this.toEntity(user));
        return savedUser.id;
    }

    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        const existing = await this.userRepository.findOne({ where: { id }, relations: { Program: true } });
        if (!existing) return false;

        Object.assign(existing, {
            first_name: user.user_first_name ?? existing.first_name,
            last_name: user.user_last_name ?? existing.last_name,
            email: user.user_email ?? existing.email,
            password: user.user_password ?? existing.password,
            microsoft_id: user.user_microsoft_id ?? existing.microsoft_id,
            auth_provider: user.user_auth_provider ?? existing.auth_provider,
            job_title: user.user_job_title ?? existing.job_title,
            department: user.user_department ?? existing.department,
            office_location: user.user_office_location ?? existing.office_location,
            mobile_phone: user.user_mobile_phone ?? existing.mobile_phone,
            business_phones: user.user_business_phones ?? existing.business_phones,
            permissions: user.user_permissions ?? existing.permissions,
            role_id: user.user_role_id ?? existing.role_id,
            status_id: user.user_status_id ?? existing.status_id,
            created_at: user.user_created_at ?? existing.created_at,
        });
        if (user.user_program_id) existing.Program = { id: user.user_program_id } as Programs;
        if (user.Programs) existing.Program = user.Programs;
        await this.userRepository.save(existing);
        return true;
    }

    async deleteUser(id: number): Promise<boolean> {
        const existing = await this.userRepository.findOne({ where: { id } });
        if (!existing) return false;
        existing.status_id = 0;
        await this.userRepository.save(existing);
        return true;
    }

    async getUserById(id: number): Promise<UserDomain | null> {
        const user = await this.userRepository.findOne({ where: { id }, relations: { Program: true } });
        return user ? this.toDomain(user) : null;
    }

    async getUserByEmail(email: string): Promise<UserDomain | null> {
        const user = await this.userRepository.findOne({ where: { email }, relations: { Program: true } });
        return user ? this.toDomain(user) : null;
    }

    async getUserByRol(rol: number): Promise<UserDomain[]> {
        const users = await this.userRepository.find({ where: { role_id: rol, status_id: 1 }, relations: { Program: true } });
        return users.map((user) => this.toDomain(user));
    }

    async getUserByProgram(programId: number): Promise<UserDomain[]> {
        const users = await this.userRepository.find({ where: { Program: { id: programId }, status_id: 1 }, relations: { Program: true } });
        return users.map((user) => this.toDomain(user));
    }

    async getAllUsers(): Promise<UserDomain[]> {
        const users = await this.userRepository.find({ where: { status_id: 1 }, relations: { Program: true } });
        return users.map((user) => this.toDomain(user));
    }
}
