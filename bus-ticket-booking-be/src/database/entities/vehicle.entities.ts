import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TripDetail, Seat, ImageResource } from '.';

@Entity({ name: 'vehicle' })
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'type', type: 'varchar', length: 100, nullable: true })
  type: string;

  @Column({ name: 'status', type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({
    name: 'license_plate',
    type: 'varchar',
    length: 20,
    nullable: true,
    unique: true,
  })
  licensePlate: string;

  @Column({
    name: 'floor_number',
    type: 'int',
    nullable: true,
    default: 1,
    unsigned: true,
  })
  floorNumber: number;

  @Column({
    name: 'total_seat',
    type: 'int',
    nullable: true,
    default: 1,
    unsigned: true,
  })
  totalSeat: number;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  deletedAt?: Date;

  // relationship
  @OneToMany(() => Seat, (seat) => seat.vehicle)
  seats: Seat[];

  @OneToMany(() => TripDetail, (tripDetail) => tripDetail.vehicle)
  tripDetails: TripDetail[];

  @OneToMany(() => ImageResource, (imageResource) => imageResource.vehicle)
  images: ImageResource[];
}
