// taken from code by Gabe Ragland from https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci

import {useEffect, useState} from "react";

export default function useDebounce<T>(value: T, delay: number) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(
		() => {
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);

			return () => {
				clearTimeout(handler);
			};
		},
		[value]
	);

	return debouncedValue;
}
