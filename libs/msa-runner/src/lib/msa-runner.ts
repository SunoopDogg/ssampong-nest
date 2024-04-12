import { exec } from 'child_process';

export const getNestProjectList = (): string[] => {
  return process.env['MICROSERVICE_LIST']?.split(', ') || [];
};

export const createCommand = (project: string): string => {
  return `yarn nx serve ${project}`;
};

export const runCommand = async (command: string): Promise<void> => {
  const child = await exec(command);

  child.stdout?.on('data', (data) => {
    console.log(data);
  });
};

export class NestRunner {
  private static PORT = 5000;
  private static MAP_PROJECT_PORT: { [key: string]: number } = {};

  public static async run(): Promise<void> {
    const projectList = getNestProjectList();

    for (const project of projectList) {
      const command = createCommand(project);
      await runCommand(command);

      this.MAP_PROJECT_PORT[project] = this.PORT;
      this.PORT++;
    }
  }

  public static getPort(project: string): number {
    return this.MAP_PROJECT_PORT[project];
  }
}

NestRunner.run();
console.log(NestRunner.getPort('auth'));
