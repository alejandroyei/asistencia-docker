import type { Request, Response } from "express";
import type { RegistrationApplication } from "../../application/RegistrationApplication";

export class RegistrationController {
    constructor(private readonly app: RegistrationApplication) {}

    async createRegistration(req: Request, res: Response): Promise<Response> {
        const users = Number(req.body?.users);
        const groups = Number(req.body?.groups);
        const status = req.body?.status === undefined ? 1 : Number(req.body.status);
        if (!Number.isInteger(users) || users < 1 || !Number.isInteger(groups) || groups < 1 || ![0, 1].includes(status)) {
            return res.status(400).json({ error: "users, groups y status válido son requeridos" });
        }
        try {
            const id = await this.app.createRegistration({ users, groups, status });
            return res.status(201).json({ message: "Inscripción creada", id });
        } catch (error) {
            if (error instanceof Error && error.message.includes("ya está inscrito")) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: "Error al crear la inscripción" });
        }
    }

    async getRegistrationById(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID inválido" });
        try {
            const registration = await this.app.getRegistrationById(id);
            return registration
                ? res.status(200).json(registration)
                : res.status(404).json({ error: "Inscripción no encontrada" });
        } catch {
            return res.status(500).json({ error: "Error al consultar la inscripción" });
        }
    }

    async getRegistrationByUser(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.user);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID de usuario inválido" });
        try {
            return res.status(200).json(await this.app.getRegistrationsByUser(id) ?? []);
        } catch {
            return res.status(500).json({ error: "Error al consultar las inscripciones del usuario" });
        }
    }

    async getRegistrationsByGroups(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.group);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID de grupo inválido" });
        try {
            return res.status(200).json(await this.app.getRegistrationByGroups(id) ?? []);
        } catch {
            return res.status(500).json({ error: "Error al consultar las inscripciones del grupo" });
        }
    }

    async getAllRegistrations(_req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json(await this.app.getAllRegistrations());
        } catch {
            return res.status(500).json({ error: "Error al consultar las inscripciones" });
        }
    }
}
