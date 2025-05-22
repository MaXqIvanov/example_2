export const getFileSize = (size: number) => {
	return (size / 1024 / 1024).toFixed(4);
};

export function formatBytes(bytes: number, decimals = 2) {
	if (!+bytes) return '0 байт';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['байт', 'кб', 'мб', 'гб', 'тб', 'PiB', 'EiB', 'ZiB', 'YiB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const toBase64 = (file: File) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});

export const getFileExtension = (name: string) => {
	const items = name?.split('.');
	if (!items) return '';
	return items[items.length - 1];
};
