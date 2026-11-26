import Joi from "joi";

export type ReturnUserData = {
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_password: string;
    user_mobile_phone: string;
    user_role_id: number;
    user_program_id: number;
    user_status_id: number;
    user_microsoft_id?: string;
    user_auth_provider?: string;
    user_job_title?: string;
    user_department?: string;
    user_office_location?: string;
    user_business_phones?: string;
    user_permissions?: JSON;
    user_created_at?: Date;
};

const personName = Joi.string().trim().min(2).max(150)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/);

const schema = Joi.object<ReturnUserData>({
    user_first_name: personName.required(),
    user_last_name: personName.required(),
    user_email: Joi.string().trim().email({ tlds: { allow: false } }).max(255).required(),
    user_password: Joi.string().min(6).max(255).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).required(),
    user_mobile_phone: Joi.string().trim().min(1).max(50).required(),
    user_role_id: Joi.number().integer().positive().required(),
    user_program_id: Joi.number().integer().positive().required(),
    user_status_id: Joi.number().integer().valid(0, 1).default(1),
    user_microsoft_id: Joi.string().allow("", null),
    user_auth_provider: Joi.string().max(20).default("local"),
    user_job_title: Joi.string().allow("", null),
    user_department: Joi.string().allow("", null),
    user_office_location: Joi.string().allow("", null),
    user_business_phones: Joi.string().allow("", null),
    user_permissions: Joi.object().unknown(true),
    user_created_at: Joi.date(),
}).unknown(false);

export const loadUserData = (data: unknown): ReturnUserData => {
    const { error, value } = schema.validate(data, { abortEarly: false, convert: true });
    if (error) throw new Error(error.details.map((detail) => detail.message).join(", "));
    return value;
};
