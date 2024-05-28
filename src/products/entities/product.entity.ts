import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from "./product-image.entity";
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column('text',{
        unique:true
    })
    title: string;

    @ApiProperty()
    @Column('numeric', 
    {
        default: 0
    })
    price:number;

    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty()
    @Column({
        unique:true,
        type: 'text',
        // default: ""
    })
    slug:string;
    
    @ApiProperty()
    @Column('int', 
    {
        default: 0
    })
    stock:number;

    @ApiProperty()
    @Column('text', 
    {
        array: true
    })
    sizes:string[];

    @ApiProperty()
    @Column('text')
    gender:string;

    @ApiProperty()
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
