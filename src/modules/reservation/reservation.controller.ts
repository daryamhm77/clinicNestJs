import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AuthDecorator,
  ClinicAuth,
} from 'src/common/decorators/auth.decorator';
import { FormType } from 'src/common/enum/form-type.enum';
import { ReservationStatus } from './enum/status.enum';

@Controller('reservation')
@ApiTags('Reservation')
@ClinicAuth()
@AuthDecorator()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOneById(+id);
  }

  @Patch(':id')
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(
    @Param('id') id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }
  @Patch(':id/status')
  updateByStatus(@Param('id') id: number, @Body() status: ReservationStatus) {
    return this.reservationService.updateReservationStatus(id, status);
  }
}
