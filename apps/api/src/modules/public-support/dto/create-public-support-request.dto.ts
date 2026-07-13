import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const platforms = ['instagram', 'facebook', 'youtube', 'other'] as const;
const languages = ['en', 'te'] as const;

export class CreatePublicSupportRequestDto {
  @IsString()
  @IsIn(platforms)
  platform!: (typeof platforms)[number];

  @IsString()
  @MaxLength(120)
  category!: string;

  @IsString()
  @MaxLength(120)
  idempotencyKey!: string;

  @IsString()
  @MaxLength(80)
  name!: string;

  @IsString()
  @MaxLength(100)
  platformHandle!: string;

  @IsString()
  @MaxLength(32)
  mobile!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => (value === '' ? undefined : value))
  email?: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @IsIn(languages)
  preferredLanguage!: (typeof languages)[number];

  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  consent!: boolean;
}
