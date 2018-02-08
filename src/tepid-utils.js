export const buildToken = auth => window.btoa(`${auth.user.shortUser}:${auth.session.id}`);

export const jobStatus = job => {
	// TODO: When TEPID 2 is deployed, remove the null checks
	// TODO: Dates should only have year if it is not current_year, and in the last ~1 hour should be XX minutes ago

	//'Refunded' : (j.failed !== -1 ? 'Failed' : (j.printed !== -1 ? 'Printed' : ('Process' + (j.processed !== -1 ? 'ed' : 'ing'))))

	let status = 'Processing...';
	if (job.processed || job.processed !== -1) {
		status = 'Processed';
	}

	if (job.printed || job.printed !== -1) {
		status = `Sent ${new Date(job.printed).toLocaleString('en-CA')}`;
	} else if(job.failed || job.failed !== -1) {
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
	return job.failed || job.failed !== -1;
};
