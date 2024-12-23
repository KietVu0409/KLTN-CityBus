import { GenderEnum, UserStatusEnum } from './../../enums';
import { Entity, OneToMany, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order, Ward, CustomerGroup, OrderRefund, PaymentHistory } from '.';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password', type: 'varchar', default: null, nullable: false })
  password?: string;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({
    name: 'code',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  code: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    default: UserStatusEnum.INACTIVATE,
    nullable: false,
  })
  status?: UserStatusEnum;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone?: string;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email?: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullName?: string;

  @Column({ name: 'gender', type: 'varchar', default: 'N', nullable: false })
  gender?: GenderEnum;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address?: string;

  @Column({ name: 'full_address', type: 'varchar', nullable: true })
  fullAddress?: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'note_status', type: 'text', nullable: true })
  noteStatus: string;

  @Column({ name: 'birthday', type: 'date', nullable: true })
  birthday?: Date;

  @Column({ name: 'otp_code', type: 'varchar', length: 10, nullable: true })
  otpCode: string;

  @Column({ name: 'otp_expired', type: 'timestamp', nullable: true })
  otpExpired: Date;

  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken?: string;

  @Column({ name: 'access_token', type: 'text', nullable: true })
  accessToken?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  public createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', select: false })
  public updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    select: false,
  })
  public deletedAt?: Date;

  // Relationships
  @ManyToOne(() => Ward, (ward) => ward.customers)
  @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  ward: Ward;

  @ManyToOne(() => CustomerGroup, (customerGroup) => customerGroup.customers)
  @JoinColumn({ name: 'customer_group_id', referencedColumnName: 'id' })
  customerGroup: CustomerGroup;

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  @OneToMany(() => OrderRefund, (order) => order.customer)
  orderRefunds?: OrderRefund[];

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.customer)
  paymentHistories: PaymentHistory[];
}
