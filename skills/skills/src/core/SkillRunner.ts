import type { ISkill, ISkillContext, ISkillResult, ISkillPhase } from '@core/interfaces/ISkill.js';

export class SkillRunner {
  private skills: Map<string, ISkill> = new Map();

  register(skill: ISkill): void {
    this.skills.set(skill.name.toLowerCase(), skill);
  }

  get(name: string): ISkill | undefined {
    return this.skills.get(name.toLowerCase());
  }

  getAll(): ISkill[] {
    return Array.from(this.skills.values());
  }

  async execute(name: string, context: ISkillContext): Promise<ISkillResult> {
    const skill = this.get(name);
    if (!skill) {
      return {
        success: false,
        output: `Skill '${name}' not found`,
      };
    }

    return skill.execute(context);
  }

  async executePhase(name: string, phaseIndex: number, context: ISkillContext): Promise<ISkillResult> {
    const skill = this.get(name);
    if (!skill) {
      return { success: false, output: `Skill '${name}' not found` };
    }

    const phase = skill.phases[phaseIndex];
    if (!phase) {
      return { success: false, output: `Phase ${phaseIndex} not found` };
    }

    return {
      success: true,
      output: `Executing phase: ${phase.name}\n\n${phase.steps.map(s => `- [ ] ${s.description}`).join('\n')}`,
      metadata: { phaseName: phase.name, steps: phase.steps.length },
    };
  }

  listPhases(name: string): ISkillPhase[] | null {
    const skill = this.get(name);
    return skill?.phases ?? null;
  }
}

export const skillRunner = new SkillRunner();
