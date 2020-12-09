const Auth = (inputUsername,inputPassword) => {
    return new Promise((resolve,reject)=>{
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", inputUsername);
        urlencoded.append("password", inputPassword);
        var requestOptions = {
            method: 'POST',
            body: {
                username: inputUsername,
                password: inputPassword
            },
            redirect: 'follow'
        };
    
        fetch("https://caro-api-client.herokuapp.com/auth/login", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (result.includes('access_token')) {
                    document.cookie = `access_token=${JSON.parse(result).access_token}; max-age=3600`;
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            })
            .catch(error => {
                resolve(false);
                console.log('error', error);
            });
    })
}
export default Auth;