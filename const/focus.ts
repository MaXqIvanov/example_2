export const typeInField = (newText: string, el: any = document.activeElement) => {
	if (!el) return;
	const start = el.selectionStart;
	const end = el.selectionEnd;
	const text = el.value;

	const before = text.substring(0, start);
	const after = text.substring(end, text.length);

	el.value = before + newText + after;
	el.selectionStart = el.selectionEnd = start + newText.length;
	el.focus();

	return el.value;
};
