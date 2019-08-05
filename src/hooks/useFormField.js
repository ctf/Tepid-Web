import {useState} from "react";

export function useFormField(initialValue=''){
	const [value, setV] = useState(initialValue);
	const onChange = (event)=>{
		setV(event.target.value)
	};

	return {value, onChange}

}