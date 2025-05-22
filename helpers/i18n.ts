// after added i18n module delete this helpers

/**
 * temporary function for define plural
 * @param count value
 * @param word
 * @returns
 */
export const getPluralizationText = (
	count: number,
	word: { empty: string; one: string; many: string; other: string }
) => {
	switch (true) {
		case count === 0:
			return word.empty;
		case count === 1:
			return word.one;
		case count > 1 && count < 5:
			return word.many;
		case count >= 5:
			return word.other;
		default:
			break;
	}
};
