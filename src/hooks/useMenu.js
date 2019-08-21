import {useState} from "react";

export default function useMenu(){
	const [anchorEl, setAnchorEl]=useState(null);
	const handleOpen = (event)=>{
		setAnchorEl(event.currentTarget)
	};
	const handleClose = ()=>{
		setAnchorEl(null)
	};

	const open = Boolean(anchorEl);

	return {anchorEl, open, handleOpen, handleClose}
}