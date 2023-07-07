import config from './config.js';

let browserApi = typeof chrome !== 'undefined' ? chrome : browser;

document.addEventListener('DOMContentLoaded', async () => {
    let email = document.getElementById('email')
    let key = document.getElementById('key')

    let storageEmail = (await browserApi.storage.local.get('email')).email
    let storageKey = (await browserApi.storage.local.get('key')).key
    if (storageEmail) {
        email.value = storageEmail
    }
    if (storageKey) {
        key.value = storageKey
    }

    document.getElementById('login').addEventListener('click', async function () {
        if (! email.value || ! key.value) {
            email = document.getElementById('email')
            key = document.getElementById('key')
        }
        if (key.value.trim() !== '' && email.value.trim() !== '') {
            let apiUrl = config.apiUrl + '?email=' + email.value
            await browserApi.tabs.query({active: true, currentWindow: true}, async function (tabs) {

                await browserApi.storage.local.set({'email': email.value})
                await browserApi.storage.local.set({'key': key.value})

                let currentTab = tabs[0];

                fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'internalKey': key.value
                    }
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.token) {
                        browserApi.cookies.set({url: currentTab.url, name: 'token', value: data.token})
                        browserApi.tabs.reload(currentTab.id)
                    }
                })
            })
        }
    })

    document.getElementById('loginandcopy').addEventListener('click', async function () {
        if (! email.value || ! key.value) {
            email = document.getElementById('email')
            key = document.getElementById('key')
        }
        if (key.value.trim() !== '' && email.value.trim() !== '') {
            let apiUrl = 'https://api.themembers.dev.br/api/get-user-token' + '?email=' + email.value
            await browserApi.tabs.query({active: true, currentWindow: true}, async function (tabs) {

                await browserApi.storage.local.set({'email': email.value})
                await browserApi.storage.local.set({'key': key.value})

                let currentTab = tabs[0];

                fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'internalKey': key.value
                    }
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.token) {
                        browserApi.cookies.set({url: currentTab.url, name: 'token', value: data.token})
                        navigator.clipboard.writeText(data.token)
                        browserApi.tabs.reload(currentTab.id)
                    }
                })
            })
        }
    })
})
