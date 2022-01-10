const bcrypt = require('bcrypt');
const { knex } = require('./database');

const verifyAPIKey = async (key, project_id) => {
    const keys = await fetchProjectKeys(project_id)
    let valid = false

    if (!keys) {
        return false;
    } else {
        for (const storedKey of keys) {
            let status = bcrypt.compareSync(key, storedKey.key)
            if (status) {
                valid = true
                return valid
            } else {
                if (keys.indexOf(storedKey) === (keys.length - 1)) {
                    return false
                }
            }
        }
    }
}

const fetchProjectKeys = async (project_id) => {
    // CHECK IF VALID
    try {
        const keys = await knex('public.api_keys')
            .select('*')
            .where({
                project: project_id
            })
        return keys || null
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.verifyAPIKey = verifyAPIKey