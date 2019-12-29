import React, {useEffect} from 'react';

import JobTable from './JobTable';

function Queue({items, jobs, loadingJobs, match, fetchNeededData}) {
	useEffect(() => {
		fetchNeededData(match.params.queueName);
	}, [match.params.queueName]);

	return (
		<JobTable jobs={items.map(it => jobs.items[it])}
				  loading={loadingJobs}
				  showUser={true}
				  canRefund={false}
		/>
	);
}

export default Queue;
