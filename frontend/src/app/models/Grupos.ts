export interface GruposModel{
    id_group: number;
    access_code_group: string;
    id_subjects: number;
    id_promotion: number;
    id_programs: number;
    status_group: number;
    subjects?: {
        id?: number;
        name_subjects: string;
    };
    promotion?: {
        id_promotion?: number;
        name_promotion: string;
    };
    programs?: {
        id: number;
        name: string;
    }
}
