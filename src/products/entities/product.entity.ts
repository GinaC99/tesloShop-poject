import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from "./product-image.entity";
import { User } from 'src/auth/entities/user.entity';


@Entity({name: 'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique:true
    })
    title: string;

    @Column('numeric', 
    {
        default: 0
    })
    price:number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        unique:true,
        type: 'text',
        // default: ""
    })
    slug:string;
    
    @Column('int', 
    {
        default: 0
    })
    stock:number;

    @Column('text', 
    {
        array: true
    })
    sizes:string[];

    @Column('text')
    gender:string;

    @Column('text',{
        array:true,
        default: []
    })
    tags:string[];

    @ManyToOne(
        () => User,
        (user)=> user.product
    )
    user: User;

    @OneToMany(
        () => ProductImage,
        (productImage)=> productImage.product,
        {
            cascade:true,
            eager: true // !! Cargar las relaciones de la db SQL
        }
    )
    image?:ProductImage[]

    @BeforeInsert()
    checkSlugInsert(){
        this.slug = this.slug ? this.slug : this.title
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugBeoreUpdate(){
        this.slug = this.slug.toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
    }
}
