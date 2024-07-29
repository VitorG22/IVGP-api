import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { exchangeCodeForAccessToken, getRepos, getRepoBranches, getRepoCommit, getAllCommits, getUser, getConnectedUser } from './callsToApi.js'
dotenv.config()


const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/hello', (req, res)=>{ 
    res.send('Hello Word')
})

app.post('/token', async (req, res) => {
    try {
        const accessToken = await exchangeCodeForAccessToken({
            code: req.body.code,
            REDIRECT_URL: req.body.REDIRECT_URL 
        })
        console.log(accessToken)
        res.send(accessToken)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/user/connected', async (req, res) => {
    console.log('connected')
    console.log('body: ', req.body)
    try {
        const userData = await getConnectedUser(req.body.accessToken)
        console.log(await userData)
        res.send(userData)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/user', async (req, res) => {
    try {
        const userData = await getUser({
            accessToken:req.body.accessToken,
            userName: req.body.userName
        })

        res.send(userData)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/repos', async (req, res) => { 
    try{
        const repos = await getRepos({
            userName: req.body.userName, 
            accessToken: req.body.accessToken
        })
        res.send(repos)
    }catch(error){
        res.sendStatus(500)
    }
})

app.post('/repo/branches', async (req, res) => { 
    try{
        const repoBranches = await getRepoBranches({
            repoName: req.body.repoName,
            userName: req.body.userName, 
            accessToken: req.body.accessToken
        })
        res.send(repoBranches)
    }catch(error){
        res.sendStatus(500)
    }
})

app.post('/repo/commit', async (req, res) => { 
    try{
        const repoCommit = await getRepoCommit({
            commitId: req.body.commitId,
            repoName: req.body.repoName,
            userName: req.body.userName, 
            accessToken: req.body.accessToken
        })
        res.send(repoCommit)
    }catch(error){
        res.sendStatus(500)
    }
})

app.post('/repo/commit/all', async (req, res) => { 
    try{
        const repoCommit = await getAllCommits({
            commitIdToFetch: req.body.commitId,
            repoName: req.body.repoName,
            userName: req.body.userName, 
            token: req.body.accessToken
        })
        res.send(repoCommit)
    }catch(error){
        res.sendStatus(500)
    }
})

const port = process.env.PORT ?? 3030
app.listen(3030, () => { console.log('server on in port: ', port ) })


