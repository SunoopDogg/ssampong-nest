import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const getMsaAppList = (): string[] => {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  const result = envConfig['MSA_APP_LIST'] || '';

  return result.split(', ');
};

const isAppExist = (app: string): boolean => {
  return fs.existsSync(`apps/${app}`);
};

const isEnvExist = (app: string): boolean => {
  return fs.existsSync(`apps/${app}/.env`);
};

const createEnv = (app: string): void => {
  fs.writeFileSync(`apps/${app}/.env`, '');
};

const updateEnvPort = (app: string, port: number): void => {
  const envConfig = dotenv.parse(fs.readFileSync(`apps/${app}/.env`));
  envConfig['PORT'] = port.toString();

  const envConfigString = Object.keys(envConfig).map((key) => {
    return `${key}=${envConfig[key]}`;
  });

  fs.writeFileSync(`apps/${app}/.env`, envConfigString.join('\n'));
};

const updateGatewayEnv = (
  app: string,
  port: number,
  mapAppToPort: Map<string, number>,
): void => {
  const envConfig = dotenv.parse(fs.readFileSync(`apps/${app}/.env`));
  envConfig['PORT'] = port.toString();

  const msaAppList = getMsaAppList();
  const msaAppListString = msaAppList
    .map((app) => {
      return `${app}`;
    })
    .join(', ');
  const msaPortListString = msaAppList
    .map((app) => {
      return `${mapAppToPort.get(app)}`;
    })
    .join(', ');

  envConfig['MSA_APP_LIST'] = msaAppListString;
  envConfig['MSA_PORT_LIST'] = msaPortListString;

  const envConfigString = Object.keys(envConfig).map((key) => {
    return `${key}=${envConfig[key]}`;
  });

  fs.writeFileSync(`apps/${app}/.env`, envConfigString.join('\n'));
};

const createCommand = (appList: string[]): string => {
  let command = `yarn nx run-many --target=serve --parallel=${appList.length} --projects=`;

  appList.forEach((project) => {
    command += `${project},`;
  });

  return command.slice(0, -1);
};

const runCommand = (command: string): void => {
  const child = spawn(command, {
    shell: true,
  });

  child.stdout.on('data', (data) => {
    console.log(`${data}`.trim());
  });

  child.stderr.on('data', (data) => {
    console.error(`${data}`.trim());
  });

  child.on('error', (error) => {
    console.error(`${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`${code}`);
  });
};

const run = (): void => {
  let port =
    parseInt(dotenv.parse(fs.readFileSync('.env'))['MSA_PORT_START']) || 5000;

  const masAppList = getMsaAppList();
  const mapProjectToPort = new Map<string, number>();

  masAppList.forEach((app) => {
    if (!isAppExist(app)) {
      console.error(`App ${app} does not exist`);
      return;
    }

    if (!isEnvExist(app)) createEnv(app);
    updateEnvPort(app, port);
    mapProjectToPort.set(app, port);
    port += 1;
  });

  const gateway = dotenv.parse(fs.readFileSync('.env'))['MSA_GATEWAY_APP'];
  if (!isEnvExist(gateway)) createEnv(gateway);
  updateGatewayEnv(
    gateway,
    parseInt(
      dotenv.parse(fs.readFileSync(`apps/${gateway}/.env`))['MSA_GATEWAY_PORT'],
    ) || 4000,
    mapProjectToPort,
  );

  const command = createCommand([gateway, ...masAppList]);
  runCommand(command);
};

run();
