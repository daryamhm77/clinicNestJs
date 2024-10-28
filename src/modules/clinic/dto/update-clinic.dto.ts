import { PartialType } from '@nestjs/swagger';
import { clinicSignupDto } from './create-clinic.dto';

export class UpdateClinicDto extends PartialType(clinicSignupDto) {}
