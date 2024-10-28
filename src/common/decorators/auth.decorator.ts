import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { clinicAuthGuard } from '../../modules/clinic/guards/clinic-auth.guard';



export function AuthDecorator() {
  return applyDecorators(ApiBearerAuth('Authorization'), UseGuards(AuthGuard));
}
export function ClinicAuth() {
  return applyDecorators(
    ApiBearerAuth('Authorization'),
    UseGuards(clinicAuthGuard),
  );
}
