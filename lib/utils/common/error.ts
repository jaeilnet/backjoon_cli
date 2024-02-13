export const errorHandling = (error: Error | string | unknown): void => {
	if (error instanceof Error) console.log(error.message);
	else console.log(error);
};
