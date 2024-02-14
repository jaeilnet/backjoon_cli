import { PackageModuleType } from 'lib/type';

export const getPackageModuleType = (): PackageModuleType => {
	return (process.env.npm_package_type as PackageModuleType) || 'commonjs';
};
