import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from "typeorm";
import { Programs } from "../../../programs/infraestructure/entities/Programs";
import { Subjects } from "../../../subjects/infraestructure/entities/Subjects";


@Entity('programs_subjects')
export class Programs_subjects{
    @PrimaryGeneratedColumn()
    id_programs_subjects!:number;

    @ManyToOne(()=>Programs, { nullable: false })
    @JoinColumn({name:"id_programs"})
    Programs!:Programs;

    @ManyToOne(()=>Subjects, { nullable: false })
    @JoinColumn({name:"id_subjects"})
    Subjects!:Subjects;

    @Column({type:"integer", nullable: false})
    status_programs_subject!:number;
}
