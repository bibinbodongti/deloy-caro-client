import { API_URL, ITEM_PER_PAGE } from "../constant/config";

export const getMatchHistories = (playerId, pageNumber) => {
    return new Promise((resolve, reject) => {
        const offset = (pageNumber - 1) * ITEM_PER_PAGE;
        const limit = ITEM_PER_PAGE;
        const bearerToken = JSON.parse(localStorage.getItem("id_token"));
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${API_URL}/matchs?playerId=${playerId}&offset=${offset}&limit=${limit}`, requestOptions)
            .then(response => response.text())
            .then(result => resolve(result))
            .catch(error => {
                reject(error);
            });
    })
}