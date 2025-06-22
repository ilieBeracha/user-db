import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  user: string;

  @Column()
  password: string;

  @Column()
  database: string;

  @Column()
  ssl: boolean;
}
