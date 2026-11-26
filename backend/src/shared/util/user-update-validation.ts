import Joi from "joi";

export type ReturnUpdateUserData = Partial<{
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_password: string;
    user_microsoft_id: string;
    user_auth_provider: string;
    user_job_title: string;
    user_department: string;
    user_office_location: string;
    user_mobile_phone: string;
    user_business_phones: string;
    user_permissions: JSON;
    user_role_id: number;
    user_program_id: number;
    user_status_id: number;
    user_created_at: Date;
}>;

const personName = Joi.string().trim().min(2).max(150)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/);

const schema = Joi.object({
    user_first_name: personName,
    user_last_name: personName,
    user_email: Joi.string().trim().email({ tlds: { allow: false } }).max(255),
    user_password: Joi.string().min(6).max(255).pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
    user_microsoft_id: Joi.string().allow("", null),
    user_auth_provider: Joi.string().max(20),
    user_job_title: Joi.string().allow("", null),
    user_department: Joi.string().allow("", null),
    user_office_location: Joi.string().allow("", null),
    user_mobile_phone: Joi.string().trim().max(50).allow("", null),
    user_business_phones: Joi.string().allow("", null),
    user_permissions: Joi.object().unknown(true),
    user_role_id: Joi.number().integer().positive(),
    user_program_id: Joi.number().integer().positive(),
    user_status_id: Joi.number().integer().valid(0, 1),
    user_created_at: Joi.date(),
}).min(1).unknown(false);

export const loadUpdateUserData = (data: unknown): ReturnUpdateUserData => {
    const { error, value } = schema.validate(data, { abortEarly: false, convert: true });
    if (error) throw new Error(error.details.map((detail) => detail.message).join(", "));
    return value as ReturnUpdateUserData;
};
