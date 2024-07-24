import axios from "axios"
import queryString from "query-string"
import dotenv from 'dotenv'
dotenv.config()

const GITHUB_ACCESS_URL = 'http://api.github.com'

// recebe um code e retorna o token de autorização do usuario 
export async function exchangeCodeForAccessToken(code) {
    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = process.env
    const body = {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URL,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    }

    const { data } = await axios.post('https://github.com/login/oauth/access_token', body, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const parseData = queryString.parse(data)
    return(parseData.access_token)
}


// recebe um token e retorna o Usuario conectado
export async function getUSer(accessToken){
    const response = await  axios.get(`${GITHUB_ACCESS_URL}/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.data
}

export async function getRepos({userName, accessToken}){
const response = await axios.get(`${GITHUB_ACCESS_URL}/users/${userName}/repos`,{
    headers:{
        Authorization: `Bearer ${accessToken}`
    }
})
return await response.data
}