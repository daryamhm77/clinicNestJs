import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlannerDto } from './dto/create-planner.dto';
import { UpdatePlannerDto } from './dto/update-planner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlannerEntity } from './entities/planner.entity';
import { Between, Not, Repository } from 'typeorm';
import { ClinicService } from '../clinic/clinic.service';
import { checkValidDays } from 'src/common/utility/validDays.util';

@Injectable()
export class PlannerService {
  constructor(
    @InjectRepository(PlannerEntity)
    private plannerRepository: Repository<PlannerEntity>,
    private clinicService: ClinicService,
  ) {}
  async create(createPlannerDto: CreatePlannerDto) {
    const { clinicId, dayName, startTime, finishTime, status } =
      createPlannerDto;
    const clinic = await this.clinicService.findOne(clinicId);
    if (!clinic) {
      throw new NotFoundException('Clinic does not exist.');
    }
    checkValidDays(dayName);
    if (new Date(startTime) >= new Date(finishTime)) {
      throw new BadRequestException('Start time must be before finish time.');
    }
    const overlap = await this.plannerRepository.findOne({
      where: {
        clinic: { id: clinicId },
        dayName,
        startTime: Between(startTime, finishTime),
      },
    });
    if (overlap) {
      throw new ConflictException(
        'There is already a planner scheduled for this time.',
      );
    }
    const newPlanner = this.plannerRepository.create({
      clinic: clinic,
      dayName,
      startTime,
      finishTime,
      status: status ?? true,
    });

    await this.plannerRepository.save(newPlanner);

    return {
      message: 'Planner created successfully.',
      plannerId: newPlanner.id,
    };
  }

  async findAll() {
    return await this.plannerRepository.find({
      relations: {
        clinic: true,
      },
    });
  }
  async findOne(id: number) {
    return await this.plannerRepository.findOneBy({ id });
  }
  async update(id: number, updatePlannerDto: UpdatePlannerDto) {
    const { clinicId, dayName, startTime, finishTime, status } =
      updatePlannerDto;

    const planner = await this.findOne(id);
    if (!planner) {
      throw new NotFoundException('planner is not founded!');
    }
    if (clinicId && clinicId !== planner.clinic.id) {
      const clinic = this.clinicService.findOne(clinicId);
      if (!clinic) throw new NotFoundException('Clinic does not exist.');
    }
    checkValidDays(dayName);
    if (
      startTime &&
      finishTime &&
      new Date(startTime) >= new Date(finishTime)
    ) {
      throw new BadRequestException('Start time must be before finish time.');
    }
    if ((dayName && dayName !== planner.dayName) || (startTime && finishTime)) {
      const overlap = await this.plannerRepository.findOne({
        where: {
          clinic: { id: clinicId },
          dayName,
          startTime: Between(
            startTime || planner.startTime,
            finishTime || planner.finishTime,
          ),
          id: Not(id),
        },
      });
      if (overlap) {
        throw new ConflictException(
          'There is already a planner scheduled for this time.',
        );
      }
    }
    await this.plannerRepository.update(id, {
      clinic: clinicId ? { id: clinicId } : planner.clinic,
      dayName: dayName ?? planner.dayName,
      startTime: startTime ?? planner.startTime,
      finishTime: finishTime ?? planner.finishTime,
      status: status ?? planner.status,
    });

    return {
      message: 'Planner updated successfully.',
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.plannerRepository.delete({ id });
    return {
      message: 'planner is deleted',
    };
  }
}

