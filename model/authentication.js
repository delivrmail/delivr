const bcrypt = require('bcrypt');
const { database } = require('./database');

const verifyAPIKey = async (key, project_id) => {
    const keys = await fetchProjectKeys(project_id)

    if (!keys) {
        return false;
    } else {
        for (const storedKey of keys) {
            let status = bcrypt.compareSync(key, storedKey.key)
            if (status) {
                const authenticated_response = {
                    valid: true,
                    user: storedKey.user,
                    project_internal_id: storedKey.project
                }

                console.log(authenticated_response)
                return authenticated_response
            } else {
                if (keys.indexOf(storedKey) === (keys.length - 1)) {
                    return false
                }
            }
        }
    }
}

const fetchProjectKeys = async (project_id) => {
    try {
        const keys = await database('public.api_keys')
            .select('*')
            .where({
                frontend_id: project_id
            })
        return keys || null
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.verifyAPIKey = verifyAPIKey