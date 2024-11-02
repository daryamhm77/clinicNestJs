import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AuthDecorator,
  ClinicAuth,
} from 'src/common/decorators/auth.decorator';
import { FormType } from 'src/common/enum/form-type.enum';
import { TransactionStatus } from './enum/status.enum';

@Controller('transactions')
@ApiTags('Transaction')
@AuthDecorator()
@ClinicAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.transactionsService.findById(+id);
  }

  @Patch(':id/status')
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(@Param('id') id: number, @Body() status: TransactionStatus) {
    return this.transactionsService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.transactionsService.remove(+id);
  }
}
