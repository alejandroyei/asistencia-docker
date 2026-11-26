import { Router } from "express";
import { RegistrationAdapter } from "../adapter/RegistrationAdapter";
import { RegistrationController } from "../controller/RegistrationController";
import { RegistrationApplication } from "../../application/RegistrationApplication";
import { authenticateToken, requireRoles, selfOrRoles } from "../../../../web/authMiddleware";

const router = Router();
//inicaializacion de las capas
const registrationAdapter = new RegistrationAdapter();
const registrationApp = new RegistrationApplication(registrationAdapter);
const userController = new RegistrationController(registrationApp);

//definicion de las rutas

router.post("/registrations", authenticateToken, async (req, res) => {
    const user = (req as typeof req & { user?: { id?: number; roleId?: number } }).user;
    if (Number(user?.roleId) === 3 && Number(user?.id) !== Number(req.body?.users)) {
        return res.status(403).json({ error: "Solo puedes inscribirte con tu propia cuenta" });
    }
    if (![1, 2, 3].includes(Number(user?.roleId))) return res.status(403).json({ error: "No tienes permiso" });
    await userController.createRegistration(req, res);
});

router.get("/registrations", authenticateToken, requireRoles(1, 2), async(req, res)=>{
    try {
        await userController.getAllRegistrations(req, res);
    } catch (error) {
        res.status(500).json({message: "Error en la consulta de datos", error});
    }
})

router.get("/registrations/id/:id", authenticateToken, requireRoles(1, 2), async (req, res)=>{
    try {
        await userController.getRegistrationById(req, res);
    } catch (error) {
        res.status(500).json({message: "Error en la consulta de datos", error});
    }
})

router.get("/registrations/user/:user", authenticateToken, selfOrRoles("user", 1, 2), async (req, res)=>{
    try {
        await userController.getRegistrationByUser(req, res);
    } catch (error) {
        res.status(500).json({message: "Error en la consulta de datos", error});
    }
})

router.get("/registrations/group/:group", authenticateToken, requireRoles(1, 2), async (req, res)=>{
    try {
        await userController.getRegistrationsByGroups(req, res);
    } catch (error) {
        res.status(500).json({message: "Error en la consulta de datos", error});
    }
})

export default router;
