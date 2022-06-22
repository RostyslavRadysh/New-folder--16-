import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { getAccessToken } from '@auth0/nextjs-auth0'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const baseUrl = `${process.env['API_BASE_URL']}/contracts`
    const { accessToken } = await getAccessToken(req, res)

    switch (req.method) {
        case 'GET': {
            const { id } = req.query
            const response = await axios.get(`${baseUrl}/${id}`, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            res.status(response.status).json(response.data)
            break
        }
        case 'PUT': {
            const { id } = req.query
            const response = await axios.put(`${baseUrl}/${id}`, req.body, {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })
            res.status(response.status).json(response.data)
            break
        }
        case 'DELETE': {
            const { id } = req.query
            const response = await axios.delete(`${baseUrl}/${id}`, {
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
