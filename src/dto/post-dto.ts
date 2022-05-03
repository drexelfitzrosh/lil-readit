import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;
  @IsString()
  @IsOptional()
  @MaxLength(80)
  description: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;
  @IsString()
  @IsOptional()
  @MaxLength(80)
  description: string;
}
