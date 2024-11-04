import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicService } from '../clinic/clinic.service';
import { UserService } from '../user/user.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { ReservationStatus } from './enum/status.enum';
import { TransactionEntity } from '../transactions/entities/transaction.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reserveRepository: Repository<Reservation>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private clinicService: ClinicService,
    private userService: UserService,
  ) { }

  async create(reserveDto: CreateReservationDto) {
    const {
      clinicId,
      userId,
      startVisitTime,
      finishVisitTime,
      date,
      paymentId,
      paymentStatus,
      status,
    } = reserveDto;

    const clinic = await this.clinicService.findOne(clinicId);
    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (new Date(startVisitTime) >= new Date(finishVisitTime)) {
      throw new BadRequestException('Start time must be before finish time');
    }
    const overlap = await this.reserveRepository.findOne({
      where: {
        clinic: { id: clinicId },
        date,
        startVisitTime,
      },
    });
    if (overlap) {
      throw new BadRequestException(
        'The clinic is already booked at the requested time',
      );
    }
    if (paymentId) {
      const payment = await this.transactionRepository.findOne({
        where: { id: paymentId },
        relations: {
          clinic: true,
          user: true,
          reservation: true,
        },
      });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
    }


    const newReservation = this.reserveRepository.create({
      clinic,
      user,
      startVisitTime,
      finishVisitTime,
      date,
      paymentStatus,
      paymentId,
      status: status || ReservationStatus.PENDING,
    });
    return await this.reserveRepository.save(newReservation);
  }
  async updateReservationStatus(id: number, status: ReservationStatus) {
    const reserve = await this.reserveRepository.findOneBy({ id });
    if (!reserve) {
      throw new NotFoundException('No Reservation!');
    }
    reserve.status = status;
    return await this.reserveRepository.save(reserve);
  }
  async update(id: number, reserveDto: UpdateReservationDto) {
    const {
      clinicId,
      userId,
      startVisitTime,
      finishVisitTime,
      date,
      paymentId,
      paymentStatus,
      status,
    } = reserveDto;
    const reserve = await this.reserveRepository.findOneBy({ id });
    if (!reserve) throw new NotFoundException('Reservation not found');
    if (clinicId && clinicId !== reserve.clinic.id) {
      const clinic = await this.clinicService.findOne(clinicId);
      if (!clinic) {
        throw new NotFoundException('clinic does not exist');
      }
    }
    if (userId && userId !== reserve.user.id) {
      const user = await this.userService.findOneById(userId);
      if (!user) throw new NotFoundException('user does not exist');
    }
    if (startVisitTime && finishVisitTime) {
      if (new Date(startVisitTime) >= new Date(finishVisitTime)) {
        throw new BadRequestException('Start time must be before finish time');
      }
    }
    if (startVisitTime || finishVisitTime || date) {
      const overlapReservation = await this.reserveRepository.findOne({
        where: {
          clinic: { id: clinicId },
          startVisitTime,
          date,
        },
      });
      if (overlapReservation && overlapReservation.id !== id) {
        throw new BadRequestException(
          'The clinic is already booked at the requested time',
        );
      }
    }
    if (date && new Date(date) <= new Date()) {
      throw new BadRequestException('Cannot set reservation to a past date');
    }
    await this.reserveRepository.update(id, {
      clinicId,
      userId,
      startVisitTime,
      finishVisitTime,
      date,
      paymentId,
      paymentStatus,
      status,
    });
  }
  async findOneById(id: number) {
    const reservation = await this.reserveRepository.findOne({
      where: { id },
      relations: ['clinic', 'user', 'payment'],
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }
  async findAll() {
    return await this.reserveRepository.find({
      relations: ['clinic', 'user', 'payment'],
    });
  }
}
