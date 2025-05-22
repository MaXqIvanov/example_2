export const getWordsEndings = (number: number, words: string[]) => {
	const index = number % 100 > 4 && number % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5];
	return words[index];
};

export const WORDS_YEAR = ['год', 'года', 'лет'];
export const WORDS_MONTH = ['месяц', 'месяца', 'месяцев'];
