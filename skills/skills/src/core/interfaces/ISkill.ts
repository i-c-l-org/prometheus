export interface ISkillContext {
  readonly workingDirectory: string;
  readonly files?: string[];
  readonly diff?: string;
  readonly config?: Record<string, unknown>;
}

export interface ISkillResult {
  readonly success: boolean;
  readonly output: string;
  readonly metadata?: Record<string, unknown>;
}

export interface ISkillPhase {
  readonly name: string;
  readonly description: string;
  readonly steps: ISkillStep[];
}

export interface ISkillStep {
  readonly id: string;
  readonly description: string;
  readonly action?: () => Promise<void>;
  readonly validate?: () => boolean;
}

export interface ISkill {
  readonly name: string;
  readonly description: string;
  readonly phases: ISkillPhase[];
  readonly metadata: ISkillMetadata;
  execute(context: ISkillContext): Promise<ISkillResult>;
}

export interface ISkillMetadata {
  readonly version: string;
  readonly author?: string;
  readonly tags: string[];
  readonly prerequisites?: string[];
}

export type SkillFactory<T extends ISkill = ISkill> = () => T;
