import { PlannerSettings } from '$lib';

export function load({ url }) {
	let serializedSettings = undefined;
	try {
		serializedSettings = JSON.parse(url.searchParams.get('settings') || '');
	} catch (e) {
		// ignore
	}
	const settings = new PlannerSettings(serializedSettings);
	return {
		settings,
	};
}
