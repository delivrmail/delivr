const { exec } = require("child_process");

const sendEmail = async () => {
	
	exec(`echo "Test from the API" | sudo mail -s "creative subject line lol" recepient@whatever.com -aFrom:sajjad@delivr.dev`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            throw error;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            throw stderr;
        }

        return stdout;
    });
}

exports.sendEmail = sendEmail;