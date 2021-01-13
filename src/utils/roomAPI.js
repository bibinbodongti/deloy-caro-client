import { API_URL } from "../constant/config";

export const getRoomInfo = (roomId) => {
    return new Promise((resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + JSON.parse(localStorage.getItem("id_token")));
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${API_URL}/rooms/${roomId}`, requestOptions)
            .then(response => response.text())
            .then(result => resolve(result))
            .catch(error => console.log('error', error));
    })
}