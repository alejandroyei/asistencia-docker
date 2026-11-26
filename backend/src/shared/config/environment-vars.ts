import joi from "joi";
import "dotenv/config";

export type returnEnvironmentVars = {
    PORT:number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
}

type validationEnvironmentVars = {
    error: joi.ValidationError | undefined,
    value: returnEnvironmentVars
}

function validateEnvVars(vars:NodeJS.ProcessEnv):validationEnvironmentVars{
    const envSchema = joi.object({
        PORT : joi.number().required(), 
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().default(5433),
        DB_USER: joi.string().required(),
        DB_PASSWORD: joi.string().allow("").required(),
        DB_NAME: joi.string().required(),
        JWT_SECRET: joi.string().min(32).required(),
    }).unknown(true);
    const {error, value} = envSchema.validate(vars);
    return {error, value};
}

const loadEnvVars = () : returnEnvironmentVars => {
    //validar los datos
    const result = validateEnvVars(process.env);
    if(result.error){
        throw new Error (result.error.message)
    }
    const value = result.value;
    return{
        PORT: value.PORT,
        DB_HOST: value.DB_HOST, 
        DB_PORT: value.DB_PORT, 
        DB_USER: value.DB_USER,
        DB_PASSWORD: value.DB_PASSWORD,
        DB_NAME: value.DB_NAME,
        JWT_SECRET: value.JWT_SECRET
    }
}

const envs = loadEnvVars();
export default envs;
