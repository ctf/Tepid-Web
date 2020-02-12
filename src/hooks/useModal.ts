import {useState} from "react";

export default function useModal(){
	const [open, setOpen] = useState<boolean>(false);
	const handleOpen = ()=>{
		setOpen(true)
	};
	const handleClose = ()=>{
		setOpen(false)
	};
	return {open, handleOpen, handleClose}
}