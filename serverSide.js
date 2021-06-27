class GithubAPI {
    constructor(){
        this.url = "https://api.github.com/users/";
    }
    async getUser(){
        const response = await fetch(this.url+searchInput.value);
        const responseData = response.json();
        return responseData;
    }
    async getRepos(user){
        const response = await fetch(this.url+user+"/repos");
        const responseData = response.json();
        return responseData;
    }
}

class RestAPI {
    constructor(){
        this.url = "http://localhost:3000/users/";
    }
    async getFavoriteUsers(){
        const response = await fetch(this.url);
        const responseData = response.json();
        return responseData;
    }
    async postFavoriteUser(allData){
        await fetch(this.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(allData),
        });
        return console.log("Successfuly POST Request");
    }
    async deleteFavoriteUser(userId){
        await fetch(this.url+userId,{
            method:"DELETE"
        });
    }
}