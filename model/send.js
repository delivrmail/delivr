const { exec } = require("child_process");

const sendEmail = async (subject_line = "", body, to, from) => {
	
	const { error, stderr, stdout } = exec(`echo "${body}" | sudo mail -s "${subject_line}" ${to} -aFrom:${from}`);

	if (error) {
		console.log(`error: ${error.message}`);
		return {
		    status: "error",
		    message: error
		};
	}

	return {
		status: "success",
		message: stdout
	};;
}

const processEmail = async (subject_line = "", body, to, from) => {
    // Check if you are sending to a list or individual

    if (typeof(to) === "string") {
        // Send to a single email
        return await sendEmail(subject_line, body, to, from);
    } else if (Array.isArray(to)) {
    	// Convert the list of emails into a comma seperated string
    	const to_string = to.join(',')

    	return await sendEmail(subject_line, body, to_string, from);

    }
}

exports.processEmail = processEmail;
