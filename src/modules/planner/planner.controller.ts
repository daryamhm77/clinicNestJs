import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlannerService } from './planner.service';
import { CreatePlannerDto } from './dto/create-planner.dto';
import { UpdatePlannerDto } from './dto/update-planner.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ClinicAuth } from 'src/common/decorators/auth.decorator';
import { FormType } from 'src/common/enum/form-type.enum';

@Controller('planner')
@ApiTags('Planner')
@ClinicAuth()
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createPlannerDto: CreatePlannerDto) {
    return this.plannerService.create(createPlannerDto);
  }

  @Get()
  findAll() {
    return this.plannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plannerService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(@Param('id') id: string, @Body() updatePlannerDto: UpdatePlannerDto) {
    return this.plannerService.update(+id, updatePlannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plannerService.remove(+id);
  }
}
