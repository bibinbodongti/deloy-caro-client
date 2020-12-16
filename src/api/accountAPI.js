export const registerAPI = (data) => {
    return new Promise((resolve, reject) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("name", data.name);
        urlencoded.append("username", data.username);
        urlencoded.append("password", data.pw);
        urlencoded.append("email", data.email);

        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://caro-api-client.herokuapp.com/auth/signup", requestOptions)
            .then(response => response.text())
            .then(result => {
                if(result==='true') resolve(true);
                else resolve(false);
            })
            .catch(error => console.log('error', error));
    })
}