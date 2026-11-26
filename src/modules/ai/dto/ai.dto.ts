/**
 * DTOs for AI Module
 * Organized by functionality: Request DTOs, Response DTOs, and Common types
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// Common DTOs
// ============================================================================

/**
 * Details of a problem including concepts, assumptions, and mistakes
 * Used in planning tutor requests
 */
export class ProblemDetailsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  discipline!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  statement!: string;

  @ApiProperty()
  @IsString()
  essentialConcepts!: string;

  @ApiProperty()
  @IsString()
  conceptsConnection!: string;

  @ApiProperty()
  @IsString()
  assumptions!: string;

  @ApiProperty()
  @IsString()
  commonMistakes!: string;

  @ApiProperty()
  @IsString()
  additionalInformation!: string;

  @ApiProperty()
  @IsString()
  instructorPlan!: string;
}

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * Request DTO for the cowrite-problem endpoint
 * Contains basic problem information to generate components
 */
export class CowriteProblemRequestDto {
  @ApiProperty({
    description: 'Title of the problem',
    example: 'Free Fall Motion',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Detailed description of the problem topic',
    example: 'A problem about objects falling under gravity',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Discipline or subject area',
    example: 'Physics',
  })
  @IsString()
  discipline!: string;

  @ApiProperty({
    description: 'The problem statement to solve',
    example:
      'A ball is dropped from a height of 100 meters. Assuming no air resistance and g=9.8 m/s², calculate the time it takes to hit the ground.',
  })
  @IsString()
  statement!: string;
}

/**
 * Request DTO for the planning-response endpoint
 * Contains problem details and student message for tutor guidance
 */
export class PlanningChatbotRequestDto {
  @ApiProperty({ type: ProblemDetailsDto })
  @ValidateNested()
  @Type(() => ProblemDetailsDto)
  problem!: ProblemDetailsDto;

  @ApiProperty({
    description: 'Student message or question',
    example: "I don't know where to start with this problem. Can you help me?",
  })
  @IsString()
  studentMessage!: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['user', 'assistant'] },
        content: { type: 'string' },
      },
    },
    required: false,
    description: 'Previous conversation history for context',
  })
  @IsOptional()
  @IsArray()
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export class EvaluationProblemDto {
  @ApiProperty()
  @IsString()
  discipline!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  statement!: string;
}

export class ConversationMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant';

  @ApiProperty()
  @IsString()
  content!: string;
}

/**
 * Request DTO for the evaluate-conversation endpoint
 * Contains all context needed to evaluate a conversation against a rubric
 */
export class EvaluateConversationRequestDto {
  @ApiProperty({ type: EvaluationProblemDto })
  @ValidateNested()
  @Type(() => EvaluationProblemDto)
  problem!: EvaluationProblemDto;

  @ApiProperty({
    type: [ConversationMessageDto],
    description: 'Complete conversation between the student and the tutor',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConversationMessageDto)
  conversationHistory!: ConversationMessageDto[];

}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Generic API response wrapper
 * Used to wrap all API responses with metadata
 */
export class ApiResponseDto<T> {
  data!: T;
  status!: number;
  success!: boolean;
}

/**
 * Conversation history entry in planning tutor
 */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}
