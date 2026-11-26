import type { UserApplication } from "../../application/UserApplication";
import type { Request, Response } from "express";
import { loadUserData } from "../../../../shared/util/user-validation";
import type { User } from "../../domain/User";
import { loadUpdateUserData } from "../../../../shared/util/user-update-validation";
import { loadEmail } from "../../../../shared/util/email.validation";
import { Programs } from "../../../programs/infraestructure/entities/Programs";

export class UserController {

    private app: UserApplication;

    constructor(application: UserApplication){
        this.app = application;
    }

    private publicUser(user: User): Omit<User, "user_password"> {
        const { user_password: _password, ...safeUser } = user;
        return safeUser;
    }

    async login(req: Request, res: Response):Promise<string | Response>{
        try {
            const {email, password} = req.body;
            if(!email || !password){
                return res.status(400)
                .json({error: "Email y contraseña requeridos"});
            }
            const token = await this.app.login(email, password);
            return res.status(200)
            .json({message: "Login éxitoso", token})
        } catch (error) {
            return res.status(401).json({ error: "Credenciales Invalidas" });
        }
    }

    async createUser (req: Request, res: Response): Promise<Response>{
        try {
            //validar datos de entrada
            const data = loadUserData(req.body);
            const user: Omit<User, "user_id"> = {
                user_first_name: data.user_first_name,
                user_last_name: data.user_last_name,
                user_email: data.user_email,
                user_password: data.user_password,
                user_microsoft_id: data.user_microsoft_id ?? "",
                user_auth_provider: data.user_auth_provider ?? "local",
                user_job_title: data.user_job_title ?? "",
                user_department: data.user_department ?? "",
                user_office_location: data.user_office_location ?? "",
                user_mobile_phone: data.user_mobile_phone,
                user_business_phones: data.user_business_phones ?? "",
                user_permissions: data.user_permissions ?? {} as JSON,
                user_role_id: data.user_role_id,
                user_program_id: data.user_program_id,
                user_status_id: data.user_status_id,
                user_created_at: data.user_created_at ?? new Date(),
                Programs: { id: data.user_program_id } as Programs,
            };

            const userId = await this.app.createUser(user);
            return res.status(201).json({message: "Usuario creado con éxito", userId});
        } catch (error) {
            if (error instanceof Error){
                return res.status(500).json({ error: "Error interno del servidor ", details: error.message });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async UpdateUser(req: Request, res: Response):Promise<Response>{
        try {
            const id = Number(req.params.id);
            if(Number.isNaN(id)){
                return res.status(400).json({error: "ID inválido"});
            }

            const dataLoad = loadUpdateUserData(req.body);
            const updated =  await this.app.updateUser(id, dataLoad);
            if (!updated){
                return res.status(404)
                .json({error: "Usuario no encontrado o sin cambios"});
            }
            return res.status(200)
                .json({message: "Usuario actualizado correctamente"});
        } catch (error) {
            if (error instanceof Error){
                return res.status(400).json({ error: error.message});
            }
            return res.status(500)
            .json({error: "Error interno del servidor"})
        }
    }

    async getUserById(req: Request, res: Response):Promise<Response> {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) return res.status(400)
                .json({error: "ID inválido"});

            const user = await this.app.getUserById(id);
            if (!user){
                return res.status(404)
                .json({error: "Id no encontrado"})
            }
            return res.status(200).json(this.publicUser(user));
        } catch (error) {
            if (error instanceof Error){
                return res.status(500)
                .json({ error: "Error interno del servidor", details: error.message});
            }
            return res.status(500)
            .json({error: "Error interno del servidor"})
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<Response> { 
        try { // Validación del email usando Joi 
            const { email } = loadEmail(req.params);  
            const user = await this.app.getUserByEmail(email);  
            if (!user) { 
                return res.status(404).json  ({message: "Rol no encontrado"});
            }  
            return res.status(200).json(this.publicUser(user)); }
        catch (error) { 
            if (error instanceof Error) { 
                return res.status(400).json({ error: error.message });  
            }
            return res.status(500).json({ error: "Error interno del servidor", 
                details: error instanceof Error ? error.message : "Error desconocido",});
        }
    }

    async getUserByRol(req: Request, res: Response): Promise<Response> { 
        try {    
            const { rol } = req.params;
            const roleId = Number(rol);
            if (!Number.isInteger(roleId) || ![1, 2, 3].includes(roleId)) {
                return res.status(400).json({ error: "Rol incorrecto" });
                }
            const user = await this.app.getUserByRol(roleId);  
            if (!user) { 
                return res.status(404).json({ message: "Usuario no encontrado" });
            }  
            return res.status(200).json(user.map((entry) => this.publicUser(entry))); 
        } catch (error) { 
            if (error instanceof Error) { 
                return res.status(400).json({ error: error.message });  
            }
            return res.status(500).json({ error: "Error interno del servidor", 
                details: error instanceof Error ? error.message : "Error desconocido",});
        }
    }

    async getUserByProgram(req:Request, res: Response): Promise<Response>{
        try {
            const { program } = req.params;
            const id = Number(program);
            if (Number.isNaN(id)) return res.status(400)
                .json({error: "ID inválido"});

            const user = await this.app.getUserByProgram(id);
            if (user === undefined) {
                return res.status(404)
                .json({error: "Id no encontrado"})
            }
            return res.status(200).json((user ?? []).map((entry) => this.publicUser(entry)));
        } catch (error) {
            if (error instanceof Error){
                return res.status(500)
                .json({ error: "Error interno del servidor", details: error.message});
            }
            return res.status(500)
            .json({error: "Error interno del servidor"})
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<Response> { 
        try { const users = await this.app.getAllUsers(); 
            return res.status(200).json(users.map((user) => this.publicUser(user))); 
        }catch (error) { 
            return res.status(500).json({ message: "Error al obtener usuarios", error });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response> { 
        try {
            const id = Number(req.params.id); 
            if (Number.isNaN(id)) return res.status(400)
                .json({ error: "ID inválido" });  
            const deleted = await this.app.deleteUser(id); 
            if (!deleted) return res.status(404)
                .json({ error: "Usuario no encontrado" });  
            return res.status(200).json({ message: "Usuario eliminado con éxito" }); 
        }catch (error) { 
            if (error instanceof Error) { 
                return res .status (500) 
                .json({ error: "Error interno del servidor", details: error.message, });  
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
