const { exec } = require("child_process");

const sendEmail = async (subject_line = "", body, to, from) => {
	
	const { error, stdout, stderr } = exec(`echo "${body}" | sudo mail -s "${subject_line}" ${to} -aFrom:${from}`);

    if (error) {
        console.log(`error: ${error.message}`);
        return {
            status: "error",
            message: error
        };
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return {
            status: "error",
            message: stderr
        };
    }

    return {
        status: "error",
        message: stdout
    };;
}

exports.sendEmail = sendEmail;