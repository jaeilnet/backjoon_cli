import fs from 'fs';

export const accessDir = (dir: string): boolean => {
	try {
		const isOk = fs.constants.F_OK || fs.constants.R_OK || fs.constants.W_OK;
		fs.accessSync(dir, isOk);
		return true;
	} catch (error) {
		return false;
	}
};
