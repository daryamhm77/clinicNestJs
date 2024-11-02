import { BadRequestException } from "@nestjs/common";

export function checkValidDays(dayname) {
  const validDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  if (!validDays.includes(dayname)) {
    throw new BadRequestException('Invalid day name provided.');
  }
}
