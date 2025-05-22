import emoji1f600 from '~/assets/image/emoji/1f600.png';
import emoji1f44d from '~/assets/image/emoji/1f44d.png';

export const supportFileImages = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
export const supportFileEmoji = ['emoji'];
export const supportFileVideo = ['video/mp4', 'video/webm'];
export const supportFileText = ['text/plain', 'txt'];
export const supportFilePdf = ['application/pdf', 'pdf'];
export const supportFileExcel = ['xlsx', 'xlsm', 'xls', 'xltx', 'xltm'];
export const supportFileWord = ['docx', 'doc'];
export const supportFiles = [...supportFilePdf, ...supportFileExcel, ...supportFileWord, ...supportFileText];

export const listEmoji = [
	{ url: emoji1f600, name: '1f600.png', type: 'image/png' },
	{
		url: emoji1f44d,
		name: '1f600.png',
		type: 'image/png'
	}
];
