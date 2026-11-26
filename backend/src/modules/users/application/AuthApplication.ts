import type { object } from "joi";
import jwt from "jsonwebtoken";
import envs from "../../../shared/config/environment-vars";

export class AuthApplication{
    static generateToken(payload:object): string{
        return jwt.sign(payload, envs.JWT_SECRET, {expiresIn: "1h"});
    }

    static verifyToken(token:string):any{
        return jwt.verify(token, envs.JWT_SECRET);
    }
}
