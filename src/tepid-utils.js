export const buildToken = auth => window.btoa(`${auth.user.shortUser}:${auth.session.id}`);

export const jobStatus = job => {
	// TODO: When TEPID 2 is deployed, remove the null checks
	// TODO: Dates should only have year if it is not current_year, and in the last ~1 hour should be XX minutes ago

	//'Refunded' : (j.failed !== -1 ? 'Failed' : (j.printed !== -1 ? 'Printed' : ('Process' + (j.processed !== -1 ? 'ed' : 'ing'))))

	let status = 'Processing...';
	if (job.processed !== null && job.processed !== -1 && job.processed !== undefined) {
		status = 'Processed';
	}

	if (job.printed !== null && job.printed !== -1 && job.printed !== undefined) {
		status = `Sent ${new Date(job.printed).toLocaleString('en-CA')}`;
	} else if(job.failed !== null && job.failed !== -1 && job.failed !== undefined) {
		status = 'Failed';
		if (job.error) {
			status = job.error;
		}
	}

	if (job.refunded) {
		status = 'Refunded';
	}

	return status;
};

export const jobIsProcessing = job => {
	return jobStatus(job) === 'Processing...';
};

export const jobHasFailed = job => {
	return (job.failed !== null && job.failed !== -1 && job.failed !== undefined);
};
