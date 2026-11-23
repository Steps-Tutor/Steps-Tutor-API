import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RubricLevelDto {
  @ApiProperty({
    description: 'Requirement or condition of this level',
    example: 'Student identifies all known and unknown quantities',
  })
  @IsString()
  requirement!: string;

  @ApiProperty({ description: 'Score for this level', example: 3 })
  @IsNumber()
  score!: number;

  @ApiProperty({ description: 'Order of this level in the hierarchy', example: 1 })
  @IsInt()
  order!: number;
}

export class RubricMetricDto {
  @ApiProperty({
    description: 'Criterion to evaluate',
    example: 'Identifies relevant concepts',
  })
  @IsString()
  criteria!: string;

  @ApiProperty({ required: false, description: 'Description of the criterion' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [RubricLevelDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => RubricLevelDto)
  levels!: RubricLevelDto[];
}
