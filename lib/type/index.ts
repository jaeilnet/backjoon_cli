export type ProblemNumberType = string;

export interface IOResultType {
	input: string[];
	output: string[];
	count: number;
}

export type PackageModuleType = 'commonjs' | 'module';

export type ProblemCrawlerType = {
	title: string;
	desc: string[];
};

export type ProblemCrawlerKey = 'description' | 'input' | 'output';

export type IProblemCrawlerType = {
	[key in ProblemCrawlerKey]: ProblemCrawlerType;
};

export type IProblemCrawlerResponseType = IProblemCrawlerType & {
	io: IOResultType;
	url: string;
};

export type ITemplate = Omit<IProblemCrawlerResponseType, 'io'>;
