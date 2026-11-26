import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { CONVERSATION_EVALUATION_RUBRIC } from './constants/conversation-evaluation-rubric.constants';
import { AIService, CowriteProblemResponse, PlanningChatbotResponse } from './services/ai.service';
import { ConversationEvaluationResponse } from './types/ai-response.types';
import {
  CowriteProblemRequestDto,
  EvaluateConversationRequestDto,
  PlanningChatbotRequestDto,
  ApiResponseDto,
} from './dto/ai.dto';

@Controller('ai')
@ApiTags('AI')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('cowrite-problem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate problem components using AI co-writing',
    description: 'Takes a problem statement and generates essential concepts, common mistakes, assumptions, and instructor plan using OpenAI.',
  })
  @ApiBody({
    type: CowriteProblemRequestDto,
    examples: {
      example1: {
        summary: 'Physics Problem Example',
        description: 'Generating components for a kinematics problem',
        value: {
          title: 'Free Fall Motion',
          description: 'A problem about objects falling under gravity',
          discipline: 'Physics',
          statement: 'A ball is dropped from a height of 100 meters. Assuming no air resistance and g=9.8 m/s², calculate the time it takes to hit the ground.',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully generated problem components',
    type: ApiResponseDto<CowriteProblemResponse>,
    examples: {
      example1: {
        summary: 'Successful response',
        value: {
          data: {
            essentialConcepts: 'Free fall motion, gravitational acceleration, kinematic equations',
            conceptsConnection: 'Free fall is a special case of uniformly accelerated motion where the only force is gravity',
            assumptions: 'No air resistance, constant gravitational acceleration (9.8 m/s²), object starts from rest',
            commonMistakes: 'Forgetting to use the square root when solving for time, confusing velocity and acceleration, incorrect unit conversions',
            additionalInformation: 'The equation s = ut + (1/2)gt² is fundamental, where s is displacement, u is initial velocity, g is acceleration, and t is time',
            instructorPlan: 'Start with basic kinematic equations, explain free fall as special case, guide students through step-by-step calculation',
          },
          status: 200,
          success: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    example: {
      data: null,
      status: 500,
      success: false,
    },
  })
  async cowriteProblem(
    @Body() request: CowriteProblemRequestDto,
  ): Promise<CowriteProblemResponse> {
    return await this.aiService.cowriteProblem(
      request.title,
      request.description,
      request.discipline,
      request.statement,
    );
  }

  @Post('planning-response')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get planning tutor response for student guidance',
    description: 'Provides interactive guidance to help students plan their approach to solving a problem using the Socratic method.',
  })
  @ApiBody({
    type: PlanningChatbotRequestDto,
    examples: {
      example1: {
        summary: 'First Turn of Planning Tutor',
        description: 'Student initiates conversation asking for guidance from the planning tutor',
        value: {
          problem: {
            id: 'prob-001',
            discipline: 'Physics',
            title: 'Free Fall Motion',
            description: 'A problem about objects falling under gravity',
            statement: 'A ball is dropped from a height of 100 meters. Assuming no air resistance and g=9.8 m/s², calculate the time it takes to hit the ground.',
            essentialConcepts: 'Free fall motion, gravitational acceleration, kinematic equations',
            conceptsConnection: 'Free fall is a special case of uniformly accelerated motion where the only force is gravity',
            assumptions: 'No air resistance, constant gravitational acceleration',
            commonMistakes: 'Forgetting square root, confusing velocity and acceleration',
            additionalInformation: 'The equation s = ut + (1/2)gt² is fundamental',
            instructorPlan: 'Start with basic kinematic equations, explain free fall as special case',
          },
          studentMessage: 'I don\'t know where to start with this problem. Can you help me?',
          conversationHistory: [],
        },
      },
      example2: {
        summary: 'Continuing Conversation with Planning Tutor',
        description: 'Student follows up after initial guidance from the planning tutor',
        value: {
          problem: {
            id: 'prob-001',
            discipline: 'Physics',
            title: 'Free Fall Motion',
            description: 'A problem about objects falling under gravity',
            statement: 'A ball is dropped from a height of 100 meters. Assuming no air resistance and g=9.8 m/s², calculate the time it takes to hit the ground.',
            essentialConcepts: 'Free fall motion, gravitational acceleration, kinematic equations',
            conceptsConnection: 'Free fall is a special case of uniformly accelerated motion',
            assumptions: 'No air resistance, constant gravitational acceleration',
            commonMistakes: 'Forgetting square root, confusing velocity and acceleration',
            additionalInformation: 'The equation s = ut + (1/2)gt² is fundamental',
            instructorPlan: 'Start with basic kinematic equations',
          },
          studentMessage: 'I think I need to use the kinematic equation. What values do I have?',
          conversationHistory: [
            {
              role: 'assistant',
              content: 'Great! Let\'s start by identifying what we know from the problem.',
            },
            {
              role: 'user',
              content: 'I don\'t know where to start with this problem. Can you help me?',
            },
          ],
        },
      },
      example3: {
        summary: "Real Problem Example",
        description: "An actual problem scenario for the planning tutor",
        value: {
          "problem": {
            "discipline": "Physics",
            "title": "Discus Throw Edited",
            "description": "Discus is a track and field sport where the athlete launches a disc by holding the disc at arm’s length and spinning their body around before releasing it. An example of a throw can be found at the link below if you are unfamiliar with the sport: https://www.youtube.com/watch?v=_wo35butdOc",
            "statement": `'<p class="leading-5 [&amp;:not(:first-child)]:mt-6" dir="ltr"><span style="white-space: pre-wrap;">As a coach for the women’s discus team, you observed one of your athletes throw the disc about 2/3 the length of a football field, and you want to estimate the net force from the athlete that was required to accomplish this throw. You can simplify the problem and model the disc as being launched from the ground, such that it starts and ends at the same height.</span></p>'`,
            "essentialConcepts": "Projectile motion; kinematics in two dimensions; Newton’s second law (force–acceleration relationship); impulse–momentum theorem; work–energy principle; estimation and order-of-magnitude reasoning.",
            "conceptsConnection": "The observed throwing distance can be related to the disc’s initial launch speed using projectile motion. That launch speed is then connected to the athlete’s applied net force through either impulse–momentum (force acting over a short time) or work–energy (force acting over a distance) relationships.",
            "assumptions": "Neglect air resistance and lift on the discus; treat the discus as a point mass; assume launch and landing heights are equal; assume an optimal launch angle (e.g., 45°) unless stated otherwise; assume the applied force is approximately constant over the acceleration phase; ignore rotational kinetic energy of the discus.",
            "commonMistakes": "Students may confuse average force with instantaneous force, or try to use projectile motion equations to directly compute force. Feedback: emphasize that projectile motion gives the required launch speed, but force must be inferred through acceleration time, distance, impulse, or energy considerations.",
            "additionalInformation": "Mass of a women’s discus (1.0 kg); approximate length of a football field (100 yd or 91.4 m); estimated acceleration distance or time during the throw; typical optimal launch angle; gravitational acceleration (9.8 m/s²).",
            "instructorPlan": "1. Interpret the given distance (2/3 of a football field) in meters.\\n2. Assume an optimal launch angle and equal launch/landing heights.\\n3. Use projectile motion equations to calculate the required initial launch speed.\\n4. Choose a physical model to relate speed to force (impulse–momentum or work–energy).\\n5. Introduce reasonable estimates for the acceleration time or distance during the throw.\\n6. Compute the average net force exerted on the discus.\\n7. Check units and reasonableness of the result.\\n8. Discuss how relaxing assumptions (air resistance, non-optimal angle, rotation) would change the estimate."
          },
          "studentMessage": "can you help me with this problem?",
          "conversationHistory": []
        }
      }
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully generated planning tutor response',
    type: ApiResponseDto<PlanningChatbotResponse>,
    examples: {
      example1: {
        summary: 'Initial guidance response from planning tutor',
        value: {
          data: {
            tutorResponse: 'Let\'s start by understanding what we\'re trying to find. The problem asks us to calculate the time it takes for a ball to fall 100 meters. Before we jump into calculations, can you tell me: What do we know from the problem statement? What are the given values?',
            isPlanComplete: false,
            currentPhase: 'understanding',
          },
          status: 200,
          success: true,
        },
      },
      example2: {
        summary: 'Follow-up guidance response',
        value: {
          data: {
            tutorResponse: 'Excellent thinking! You\'re on the right track with the kinematic equations. From the problem, we have: initial height = 100m, initial velocity = 0 (it\'s dropped, not thrown), and acceleration = 9.8 m/s². Now, do you know which kinematic equation relates these quantities to time?',
            isPlanComplete: false,
            currentPhase: 'equation_selection',
          },
          status: 200,
          success: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    example: {
      data: null,
      status: 500,
      success: false,
    },
  })
  async planningChatbotResponse(
    @Body() request: PlanningChatbotRequestDto,
  ): Promise<PlanningChatbotResponse> {
    return await this.aiService.planningChatbotResponse(
      request.problem,
      request.studentMessage,
      request.conversationHistory,
    );
  }

  @Post('evaluate-conversation')
  @ApiOperation({
    summary: 'Evaluate a student-tutor conversation against a rubric',
    description:
      'Evaluates the student messages in the provided conversation against the predefined rubric and returns the level achieved, reasoning and evidence for each criterion.',
  })
  @ApiBody({
    type: EvaluateConversationRequestDto,
    examples: {
      example1: {
        summary: 'Evaluate a planning conversation',
        value: {
          problem: {
            discipline: 'Physics',
            title: 'Free Fall Motion',
            description: 'A problem about objects falling under gravity',
            statement:
              'A ball is dropped from a height of 100 meters. Assuming no air resistance and g=9.8 m/s², calculate the time it takes to hit the ground.',
          },
          conversationHistory: [
            {
              role: 'user',
              content: "I don't know where to start with this problem.",
            },
            {
              role: 'assistant',
              content: 'What do we know from the problem statement?',
            },
            {
              role: 'user',
              content:
                'The height is 100 m, the initial velocity is 0 and a = 9.8 m/s².',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully evaluated the conversation',
    type: ApiResponseDto<ConversationEvaluationResponse>,
    examples: {
      example1: {
        summary: 'Successful response',
        value: {
          data: {
            evaluation: [
              {
                level_achieved: 2,
                reasoning: 'The student identified the height, initial velocity and acceleration.',
                evidence: [
                  'The height is 100 m, the initial velocity is 0 and a = 9.8 m/s².',
                ],
                criteria_title: 'Identifies known and unknown quantities',
                criteria_number: 1,
              },
            ],
          },
          status: 200,
          success: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    example: {
      data: null,
      status: 500,
      success: false,
    },
  })
  async evaluateConversation(
    @Body() request: EvaluateConversationRequestDto,
  ): Promise<ConversationEvaluationResponse> {
    return await this.aiService.evaluateConversationWithRubric(
      request.problem,
      request.conversationHistory,
      CONVERSATION_EVALUATION_RUBRIC,
    );
  }
}
