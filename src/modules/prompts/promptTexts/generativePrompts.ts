export const createCowriteProblemPrompt = (
  title: string,
  description: string,
  discipline: string,
  statement: string,
) => `
    You are an expert of ${discipline} discipline. Consider the following problem details:
    Title: ${title}
    Description: ${description}
    Problem Statement: ${statement}
    Based on the above details of the problem, generate the following components to help co-write the problem:
    1. What are the essential concepts related to this problem?
    2. Describe how the concepts and skills above connect to the problem.
    3. List any assumptions and simplifications needed to solve this problem.
    4. If you expect students to make a common mistake, describe the mistake and provide feedback to address any misunderstandings.
    5. What additional information can help in solving this problem?
    6. Write a detailed step-by-step plan to solve the problem as an instructor.
    `;

export const createPlanningEvaluationPrompt = (
  discipline: string,
  problemTitle: string,
  problemDescription: string,
  problemStatement: string,
  rubricString: string,
  levelsCount: number,
) => `
    You are an expert of ${discipline} discipline. Consider the following problem details:
    Title: ${problemTitle}
    Description: ${problemDescription}
    Problem Statement: ${problemStatement}
    Based on the above details of the problem, a student has gone through a framework to plan a solution to the problem. To go through the framework, the student has had a conversation with an AI assistant to plan the solution. The student has provided their final plan to the AI assistant. Your task is to evaluate the student's ability to follow the framework and provide feedback on their planning steps. Provide a detailed evaluation of the student's planning steps, highlighting areas where they have followed the framework correctly and areas where they may have deviated from the framework.
    To evaluate the conversation between the student and the AI assistant, consider the following rubric criteria:
    ${rubricString}
    You will apply the rubric to the complete conversation between the student and the AI assistant, and determine the closest score or level that the student has achieved for each criterion. You will have the complete conversation between the student and the AI assistant to have the context, but you must only evaluate the student messsages. If a criterion is not observed in the messages from the student, choose the lowest performance level.
    Response Format:
    Respond in JSON the level achieved out of ${levelsCount} levels given for each of the above mentioned evaluation criteria of the rubric in the following format:
    [
      {
        level_achieved: number,
        reasoning: string,
        score: number,
        criteria_title: string,
        criteria_number: number,
      },
      {
        level_achieved: number,
        reasoning: string,
        score: number,
        criteria_title: string,
        criteria_number: number,
      },
    ]
    Provide a brief explanation for each criterion, highlighting areas where the student has followed the framework correctly and areas where they may have deviated from the framework under the reasoning key.
    `;

export const createEvaluationWithRubricPrompt = (
  discipline: string,
  problemTitle: string,
  problemDescription: string,
  problemStatement: string,
  rubricString: string,
  maxLevels: number,
  numberOfCriteria: number,
) => `
    ## Problem Context
    You are an expert of ${discipline} discipline. Consider the following problem details:
    Title: ${problemTitle}
    Description: ${problemDescription}
    Problem Statement: ${problemStatement}
    (The statement may contain KaTeX HTML. Extract equations from data-equation and convert to required Unicode format only when referencing them.)
    
    ## Student-Tutor Conversation Context
    The student has had a conversation with an AI tutor to find the solution to the problem while following the problem solving framework. 
    
    ## Evaluation Instructions
    You help assess a conversation between a student and a tutor using a rubric. You will apply the rubric to the complete conversation and determine the closest or most correct level of performance for each criterion. You will receive the full conversation between the student and the tutor for context, but you must only evaluate the student messages and consider their order if that is important for a criterion. If a criterion is not observed in the student's messages, choose the lowest performance level.
    Your task is to evaluate the student's conversation based on the following rubric:
    ${rubricString}
    You will apply the rubric to the complete conversation between the student and the AI assistant, and determine the closest score or level that the student has achieved for each criterion. You will have the complete conversation between the student and the AI assistant to have the context, but you must only evaluate the student messages. If a criterion is not observed in the messages from the student, choose the lowest performance level.
    Make sure to consider all relevant student messages and provide evidence for your evaluation.

    ##Response Format:
    Respond in JSON the level achieved out of ${maxLevels} levels given for each of the above mentioned evaluation criteria of the rubric in the following format:
    [
      {
        level_achieved: number,
        reasoning: string,
        evidence: Array<string>,
        criteria_title: string,
        criteria_number: number,
      },
      {
        level_achieved: number,
        reasoning: string,
        evidence: Array<string>,
        criteria_title: string,
        criteria_number: number,
      },
    ]
    Provide a brief explanation for each criterion, highlighting areas where the student has followed the framework correctly and areas where they may have deviated from the framework under the reasoning key. In the evidence key, provide specific excerpts from the student's conversation that support your evaluation.
    Make sure that you only provide only one JSON array in your response, containing the evaluation for all ${numberOfCriteria} criteria.
    `;
