import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        unique: true,
        type: 'text'
    })
    email:string;
    @Column({
        type: 'text',
        select: false
    })
    password:string;
    
    @Column({
        type: 'text'
    })
    fullname:string;
    
    @Column({
        type: 'bool',
        default:true
    })
    isActive: boolean;
    @Column({
        array:true,
        default: ['user'],
        type: 'text'
    })
    roles:string[];

    @BeforeInsert()
    checkFiledBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }
    checkFieldAfterInsert(){
        this.checkFiledBeforeInsert()
    }

}
