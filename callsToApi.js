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
    return (parseData.access_token)
}


// recebe um token e retorna o Usuario conectado
export async function getConnectedUser(accessToken) {
    const response = await axios.get(`${GITHUB_ACCESS_URL}/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.data
}
export async function getUser({accessToken, userName}) {
    const response = await axios.get(`${GITHUB_ACCESS_URL}/user/${userName}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.data
}

// retorna todos os repositorios de usuario
export async function getRepos({ userName, accessToken }) {
    const response = await axios.get(`${GITHUB_ACCESS_URL}/users/${userName}/repos`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.data
}

export async function getRepoBranches({ userName, accessToken, repoName }) {
    const response = await axios.get(`${GITHUB_ACCESS_URL}/repos/${userName}/${repoName}/branches`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.data
}

export async function getRepoCommit({ userName, accessToken, repoName, commitId }) {
    const response = await axios.get(`${GITHUB_ACCESS_URL}/repos/${userName}/${repoName}/commits/${commitId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return await response.data
}

export async function getAllCommits({ commitIdToFetch, token, repoName, userName, currentList = [] }) {
    let commitsList = currentList
    const commitData = await getRepoCommit({
        accessToken: token,
        commitId: commitIdToFetch,
        repoName: repoName,
        userName: userName
    })

    let lastCommitIndex = commitsList.length
    var newCommit = {
        commitData: commitData,
        nextCommitId: commitsList[lastCommitIndex - 1]?.commitData.sha ?? null
    }
    commitsList.push(newCommit)
    if (commitsList[lastCommitIndex].commitData.parents.length > 0) {
        console.log(commitsList[lastCommitIndex]?.commitData.parents[0].sha)
        return await getAllCommits({
            currentList: commitsList,
            commitIdToFetch: commitsList[lastCommitIndex]?.commitData.parents[0].sha,
            token: token,
            repoName: repoName,
            userName: userName
        })
    }
    return commitsList

}