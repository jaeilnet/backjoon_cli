export const errorHandling = (error: Error | string | unknown) => {
	if (error instanceof Error) console.log(error.message);
	else console.log(error);
};
