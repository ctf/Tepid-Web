import fetch from 'cross-fetch';

// TODO require url to not end with forward slash
const api_url = "";

const tepidGetObject = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
};

export function tepidGetJson(path: string): Promise<any> {
    return fetch(`${api_url}/${path}`, tepidGetObject)
        .then(response => response.json())
}

const tepidPostObject = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

export function tepidPostJson(path: string, body: any): Promise<any> {
    return fetch(`${api_url}/${path}`, {
        ...tepidPostObject,
        body: body
    }).then(response => response.json())
}

const tepidDeleteObject = {
    method: 'DELETE'
};

export function tepidDelete(path: string): Promise<any> {
    return fetch(`${api_url}/${path}`, tepidDeleteObject)
}