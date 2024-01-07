/** The max number of characters to shown in the toast message */
const MAX_CHARS = 200;

export interface ToastOptions {
	/** How long the message should stay visible. @defaults based on length of message */
	duration: number;

	/** The level of aleart of the toast message. @default info */
	level: 'info' | 'success' | 'error';
}
type Bread = { message: string; start: number; id: string } & ToastOptions;

export const toastState = new (class ToastState {
	list: Bread[] = [];
})();

/** Adds a toast notification to the bottom of the page with the given message */
function showToast(message: string, options?: Partial<ToastOptions>) {
	if (!message?.length) return;
	if (options?.level === 'error') console.error(message);
	const id = `${Date.now()}-${Math.random()}}`;
	const defaultDuration =
		options?.level === 'error' ? 12000 : 4000 + Math.min(MAX_CHARS, message.length) * 50;
	const duration = options?.duration || defaultDuration;
	toastState.list = [
		...toastState.list.slice(-4),
		{
			message:
				message.length > MAX_CHARS ? `${message.slice(0, MAX_CHARS - 3)}...` : message,
			id,
			start: Date.now(),
			duration,
			level: 'info',
			...options,
		},
	];
	setTimeout(() => {
		toastState.list = toastState.list.filter((t) => t.id !== id);
	}, duration);
}

interface ToastController {
	error: (message: string, duration?: number) => void;
	success: (message: string, duration?: number) => void;
	info: (message: string, duration?: number) => void;
	(message: string, options?: Partial<ToastOptions>): void;
}

/** Adds a toast notification to the bottom of the page with the given message */
export const toast: ToastController = Object.assign(showToast, {
	error: (message: string, duration?: number) => {
		showToast(message, { level: 'error', duration });
	},
	success: (message: string, duration?: number) => {
		showToast(message, { level: 'success', duration });
	},
	info: (message: string, duration?: number) => {
		showToast(message, { level: 'info', duration });
	},
});
