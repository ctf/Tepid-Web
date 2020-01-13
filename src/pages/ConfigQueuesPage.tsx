import React from "react";
import {Card} from "antd";
import {RootState} from "../reducers";
import {useDispatch, useSelector} from "react-redux";
import PrintQueueCard from "../components/PrintQueue";
import * as actions from "../actions";
import {PrintQueue} from "../models";


function ConfigQueuesPage({}) {

	const dispatch = useDispatch();
	dispatch(actions.fetchQueuesIfNeeded());

	const s0 = (state: RootState) => state.queues.items;
	const queues = useSelector(s0);

	const t:PrintQueue[] = Object.values(queues);

	if (queues && Object.keys(queues).length >0) {
		return <>
			{Object.values(queues).map((q: PrintQueue)=> {return <PrintQueueCard printQueue={q}/>})}

			</>
	}
	return <Card>:(</Card>
}

export default ConfigQueuesPage