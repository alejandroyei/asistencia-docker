import { Router } from "express";
import { SessionAdapter } from "../adapter/SessionAdapter";
import { SessionApplication } from "../../application/SessionApplication";
import { SessionController } from "../controller/SessionController";
import { authenticateToken, requireRoles } from "../../../../web/authMiddleware";

const router = Router();

const sessionAdapter = new SessionAdapter();
const sessionApp = new SessionApplication(sessionAdapter);
const sessionController = new SessionController(sessionApp);

router.post("/sesiones", authenticateToken, requireRoles(1, 2), async (req,res)=>{
    try {
        await sessionController.createSession(req,res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creacion de la sesion", error });
    }
})

router.get("/sesiones", authenticateToken, async (req, res)=>{
    try {
        await sessionController.getAllSession(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la obtencion de las sesiones"});
    }
})

router.get("/sesion/id/:id", authenticateToken, async (req, res)=>{
    try {
        await sessionController.getSessionById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la obtencion de la sesion"});
    }
})

router.get("/sesiones/date/:date", authenticateToken, async (req, res)=>{
    try {
        await sessionController.getAttendanceByDate(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la obtencion de la sesion"});
    }
})

router.get("/sesiones/grupoid/:grupoid", authenticateToken, async (req, res)=>{
    try {
        await sessionController.getSessionByGroup(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la obtencion de las sesiones del grupo"});
    }
})

router.put("/sesiones/actualizar/id/:id", authenticateToken, requireRoles(1, 2), async (req, res)=>{
    try {
        await sessionController.updateSession(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la actualizacion de la sesion"});
    }
})

router.put("/sesiones/eliminar/id/:id", authenticateToken, requireRoles(1, 2), async (req, res)=>{
    try {
        await sessionController.deleteSession(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la eliminacion de la sesion"});
    }
})

export default router;
