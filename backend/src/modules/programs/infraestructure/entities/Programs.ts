
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Programs {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: "varchar"})
    name!: string;
}