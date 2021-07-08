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

class LStorage {
    getUsersToLocalStorage(){
        let lastUsers;
        if(localStorage.getItem("lastUsers") == null){
            lastUsers = [];
        }else{
            lastUsers= JSON.parse(localStorage.getItem("lastUsers"));
        }
        return lastUsers;
    }
    addUserToLocalStorage(userName){
        let lastUsers = this.getUsersToLocalStorage();

        let isHave = lastUsers.indexOf(userName);
        if(isHave != -1){
            lastUsers.splice(isHave,1);
            lastUsers.unshift(userName);
            localStorage.setItem("lastUsers",JSON.stringify(lastUsers));
            return;
        }
        
        lastUsers.unshift(userName);
        localStorage.setItem("lastUsers",JSON.stringify(lastUsers));
    }
    removeUserFromLocalStorage(userName){
        let lastUsers = this.getUsersToLocalStorage();
        // Delete Selected Last User
        if(userName){
            lastUsers.filter((user,index)=>{
                if(user === userName){
                    lastUsers.splice(index,1);
                    localStorage.setItem("lastUsers",JSON.stringify(lastUsers));
                }
            });
            return;
        }
        // Delete All Last Users
        localStorage.removeItem("lastUsers");
    }
}