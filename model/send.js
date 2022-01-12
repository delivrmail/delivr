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

exports.sendEmail = sendEmail;