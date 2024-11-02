import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ClinicService } from '../clinic/clinic.service';
import { UserService } from '../user/user.service';
import { ReservationService } from '../reservation/reservation.service';
import { TransactionStatus } from './enum/status.enum';
import { ReservationStatus } from '../reservation/enum/status.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private clinicService: ClinicService,
    private userService: UserService,
    private reservationService: ReservationService,
  ) {}
  async create(transactionDto: CreateTransactionDto) {
    const { clinicId, userId, reservationId, status, date, amount } =
      transactionDto;
    const clinic = await this.clinicService.findOne(clinicId);
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reservation =
      await this.reservationService.findOneById(reservationId);
    if (
      !reservation ||
      reservation.clinicId !== clinicId ||
      reservation.userId !== userId
    ) {
      throw new BadRequestException('Invalid reservation');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const transaction = this.transactionRepository.create({
      clinicId,
      userId,
      reservationId,
      status: status || TransactionStatus.PENDING,
      amount,
      date,
    });

    const finalTransaction = await this.transactionRepository.save(transaction);
    if (finalTransaction.status === TransactionStatus.COMPLETED) {
      await this.reservationService.updateReservationStatus(
        reservationId,
        ReservationStatus.CONFIRMED,
      );
    }
    return finalTransaction;
  }
  async findAll() {
    return await this.transactionRepository.find({
      relations: {
        clinic: true,
        user: true,
        reservation: true,
      },
    });
  }
  async findById(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        clinic: true,
        user: true,
        reservation: true,
      },
    });
    if (!transaction) throw new NotFoundException('No Transaction!');

    return transaction;
  }
  async updateStatus(id: number, status: TransactionStatus) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) throw new NotFoundException('No Transaction!');

    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot change status of a completed transaction',
      );
    }

    transaction.status = status;
    return await this.transactionRepository.save(transaction);
  }
  async remove(id: number) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) throw new NotFoundException('No Transaction!');

    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new BadRequestException('Cannot delete a completed transaction');
    }
    await this.transactionRepository.delete({ id });
  }
}
