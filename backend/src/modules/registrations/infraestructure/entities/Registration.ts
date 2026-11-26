import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/infraestructure/entities/User';
import { Group } from '../../../groups/infraestructure/entities/Group';

@Entity('registrations')
export class Registration{
    @PrimaryGeneratedColumn()
    id_registrations!:number;

    @ManyToOne(()=> User, { nullable: false })
    @JoinColumn({name:"id_users"})
    User!:User;

    @ManyToOne(()=> Group, { nullable: false })
    @JoinColumn({name:"id_groups"})
    Groups!:Group;

    @Column({type:"integer", nullable: false})
    status_registrations!:number;
}
