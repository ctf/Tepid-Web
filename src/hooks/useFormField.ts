import {useState} from "react";

export function useFormField<T>(initialValue){
	const [value, setV] = useState<T>(initialValue);
	const onChange = (event)=>{
		setV(event.target.value)
	};

	return {value, onChange}

}