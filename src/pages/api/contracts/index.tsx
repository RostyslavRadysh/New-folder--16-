import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { getAccessToken } from '@auth0/nextjs-auth0'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const baseUrl = `${process.env['API_BASE_URL']}/contracts`
    const { accessToken } = await getAccessToken(req, res)

    switch (req.method) {
        case 'POST': {
            const response = await axios.post(baseUrl, req.body, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            res.status(response.status).json(response.data)
            break
        }
        case 'GET': {
            const response = await axios.get(baseUrl, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            res.status(response.status).json(response.data)
            break
        }
        default: {
            res.status(400)
        }
    }
}

export default withApiAuthRequired(handler)
