const { exec } = require("child_process");

const sendEmail = async (subject_line = "", body, to, from) => {
	
	exec(`echo "${body}" | sudo mail -s "${subject_line}" ${to} -aFrom:${from}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return error;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return stderr;
        }

        return stdout;
    });
}

exports.sendEmail = sendEmail;