export const getSplitPairToken = (value: string): { first: string; second: string } => {
	const pairOfTokens = value?.split('-');
	return { first: pairOfTokens?.[0] || '', second: pairOfTokens?.[1] || '' };
};
