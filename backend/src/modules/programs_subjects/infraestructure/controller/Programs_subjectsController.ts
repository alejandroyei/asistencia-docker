import type { Request, Response } from "express";
import type { Programs_subjectsApplication } from "../../application/Programs_subjectsApplication";

export class Programs_subjectsController {
    constructor(private readonly app: Programs_subjectsApplication) {}

    async getPrograms_subjectsById(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID inválido" });
        try {
            const entry = await this.app.getPrograms_subjectsById(id);
            return entry ? res.status(200).json(entry) : res.status(404).json({ error: "Relación no encontrada" });
        } catch {
            return res.status(500).json({ error: "Error al consultar la relación programa-materia" });
        }
    }

    async getPrograms_subjectsByPrograms(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.programs);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID de programa inválido" });
        try {
            return res.status(200).json(await this.app.getPrograms_subjectsByPrograms(id) ?? []);
        } catch {
            return res.status(500).json({ error: "Error al consultar materias del programa" });
        }
    }

    async getPrograms_subjectsBySubjects(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.subjects);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "ID de materia inválido" });
        try {
            return res.status(200).json(await this.app.getPrograms_subjectsBySubjects(id) ?? []);
        } catch {
            return res.status(500).json({ error: "Error al consultar programas de la materia" });
        }
    }

    async getAllPrograms_subjects(_req: Request, res: Response): Promise<Response> {
        try {
            return res.status(200).json(await this.app.getAllPrograms_subjects());
        } catch {
            return res.status(500).json({ error: "Error al consultar relaciones programa-materia" });
        }
    }
}
