/**
 * extract-instruct.mjs: Extracts formatInstructModeChat output from ST.
 *
 * Input scenario JSON shape:
 * {
 *   message: string,
 *   isUser: boolean,
 *   isNarrator: boolean,
 *   forceAvatar: string,
 *   charName: string,
 *   userName: string,
 *   forceOutputSequence: boolean | number,
 *   template: InstructSettings
 * }
 */

import { resetHarnessState } from '../shims/globals.mjs';

/**
 * Run the instruct extraction against ST's real formatInstructModeChat.
 */
export async function extractInstruct(scenario, stModules) {
  resetHarnessState();

  const instructMod = stModules.instruct;
  if (!instructMod?.formatInstructModeChat) {
    throw new Error('formatInstructModeChat not available in ST instruct module');
  }

  const {
    message, isUser, isNarrator, forceAvatar, charName, userName,
    forceOutputSequence = false, template,
  } = scenario;

  // Override power_user.instruct with the scenario's template
  const { power_user } = await import('../shims/power-user-shim.mjs');
  const originalInstruct = { ...power_user.instruct };
  Object.assign(power_user.instruct, template);

  try {
    const result = instructMod.formatInstructModeChat(
      charName,
      message,
      isUser,
      isNarrator,
      forceAvatar,
      userName,
      charName,
      forceOutputSequence,
      template, // customInstruct override
    );

    return {
      output: result,
      scenario: scenario._description,
      template_used: template.input_sequence?.slice(0, 30) + '...',
    };
  } finally {
    // Restore original instruct settings
    Object.assign(power_user.instruct, originalInstruct);
  }
}
