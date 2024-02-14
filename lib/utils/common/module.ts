import { PackageModuleType } from 'lib/type';
import { readFileSync } from 'node:fs';

export const getPackageModuleType = (): PackageModuleType => {
	if (process.env.npm_package_type) {
		return process.env.npm_package_type as PackageModuleType;
	}

	const readFile = readFileSync(process.env.PWD + '/package.json').toString();
	const json = JSON.parse(readFile);
	const type = json.type as PackageModuleType;

	return type;
};
