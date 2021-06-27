class UI {
    constructor(){
        this.searchInput = document.getElementById("searchUser");
        this.secondCardBody = document.querySelectorAll(".card-body")[1];
        this.usersArea = document.getElementById("users");
        this.homeText = document.getElementById("homeText");
        this.favoritesBadge = document.getElementById("favoritesBadge");
    }
    clearInput(){
        this.searchInput.value = "";
    }
    messageCard(message,type){
        const div = document.createElement("DIV");
        div.innerHTML = message;
        div.className = `alert alert-${type}`;
        this.secondCardBody.prepend(div);

        setTimeout(() => {
            div.remove();
        }, 2000);
    }
    createUserCard(userData,reposData,isHave,userIdFromJsonApi){
        this.homeText.className = "d-none";
        let liElement;
        reposData.forEach(repo => {
            liElement += "<li class='list-group-item'>"+repo.name+"</li>"
        });

        this.usersArea.innerHTML += `
            <div class="row mt-4">
            <hr>
                <div class="col-md-4  mb-3">
                    <a href="${userData.url}">
                        <img class="img-thumbnail" src="${userData.avatar_url}" alt="${userData.name}" width="400">
                    </a>
                    <hr>
                    <div class="text-start">
                        <span class="fw-bold">Name:</span> <span>${userData.name}</span><br>
                        <span class="fw-bold">Company:</span> <span>${userData.company}</span><br>
                        <span class="fw-bold">Location:</span> <span>${userData.location}</span><br>
                    </div>
                    <hr>
                </div>
                <div class="col-md-8">
                    <div class="d-flex justify-content-between">
                        <span>
                            <button type="button" class="btn btn-success">Followers <span class="badge bg-secondary">${userData.followers}</span></button>
                            <button type="button" class="btn btn-primary">Following <span class="badge bg-secondary">${userData.following}</span></button>
                            <button type="button" class="btn btn-danger">Repos <span class="badge bg-secondary">${userData.public_repos}</span></button>
                        </span>
                        <span>
                            <span class="d-none">${userIdFromJsonApi}</span>
                            <i class="fas fa-heart${isHave ? " text-danger":""}"></i>
                        </span>
                    </div>
                    <span class="d-inline-block fs-4 mt-2"><b>Repositories</b></span>
                    <ul class="list-group mt-2 mb-4 me-5">${liElement.trim().replace("undefined"," ")}</ul>
                </div>
                <hr>
            </div>
        `;
    }
    addUserToUIFromGithubApi(userData,reposData,isHave,userIdFromJsonApi){
        this.createUserCard(userData,reposData,isHave,userIdFromJsonApi);

        this.sendTheJsonApiUsersData = {
            userData,
            reposData
        };
    }
    goHomeToUI(){
        $("#users").empty();
        this.homeText.className = "d-block";
    }
    addUserToFavorites(item){
        if(item.className == "fas fa-heart"){
            jsonRestApi.postFavoriteUser(this.sendTheJsonApiUsersData);

            item.classList.add("text-danger");
            this.favoritesBadge.innerHTML++;

        }else if(item.className == "fas fa-heart text-danger"){
            jsonRestApi.deleteFavoriteUser(item.previousElementSibling.innerHTML);

            item.classList.remove("text-danger");
            this.favoritesBadge.innerHTML--;
        }
    }
    addUsersToUIFromJsonApi(usersDataFromJsonApi){
        $("#users").empty();

        usersDataFromJsonApi.forEach(userDataFromJsonApi=>{
            this.createUserCard(
                userDataFromJsonApi.userData,
                userDataFromJsonApi.reposData,
                "Have",
                userDataFromJsonApi.id
            );
        });
    }
}