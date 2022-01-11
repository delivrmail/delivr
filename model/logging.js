const { database } = require('./database');

const createLog = async (user, subject_line = null, body, body_type, to, from, project) => {
    try {
        const result = await database('public.logs')
            .insert({
                status: "PENDING",
                user: user,
                subject_line: subject_line,
                body: body,
                body_type: body_type,
                to: to,
                from: from,
                project: project
            })
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}

const updateLog = async (status, log_id) => {}

exports.createLog = createLog;