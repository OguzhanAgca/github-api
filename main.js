const form = document.getElementById("form");
const searchInput = document.getElementById("searchUser");
const homeBtn = document.getElementById("home");
const usersArea = document.getElementById("users");
const favoritesBtn = document.getElementById("favorites");
const favoritesBadge = document.getElementById("favoritesBadge");

eventListeners();

const githubApi = new GithubAPI();
const jsonRestApi = new RestAPI();
const ui = new UI();

function eventListeners(){
    form.addEventListener("submit",addUser);
    homeBtn.addEventListener("click",goHome);
    usersArea.addEventListener("click",addFavoritesForClick);
    favoritesBtn.addEventListener("click",getFavoriteUsers);
}

function addUser(e){
    const searchInputValue = searchInput.value.trim();

    if(searchInputValue === ""){

        ui.messageCard("Please do not empty your username!","danger");
        searchInput.focus();
        searchInput.classList.add("is-invalid");
    }else{

        // Has the searched user been favorited before? If yes, user card will come with like
        let isHave,userIdFromJsonApi;
        jsonRestApi.getFavoriteUsers()
        .then(usersDataFromJsonApi => {
            usersDataFromJsonApi.filter(user=>{
                if(user.userData.login === searchInputValue){
                    return isHave = "Have", userIdFromJsonApi = user.id;
                }
            });
        })
        .catch(err=>console.log(err));
    
        githubApi.getUser()
        .then(userDataFromGithub=>{
            // If there is not user searched on github
            if(userDataFromGithub.message === 'Not Found'){
                ui.messageCard(`User <b>${searchInputValue}</b> not found! Please try again..`,"danger");
                searchInput.focus();
                searchInput.classList.add("is-invalid");
            }else{
                // Has the user been searched before?
                githubApi.getRepos(userDataFromGithub.login)
                .then(reposDataFromGithub=>{
                    let sameUser;
                    Array.from(usersArea.children).filter(user=>{
                        // Comparison same user URLs
                        if(user.children[1].firstElementChild.href === userDataFromGithub.url){
                            return sameUser = true;
                        }
                    });
                    
                    if(sameUser){
                        ui.messageCard(`You already searched for <b>${userDataFromGithub.login}</b>`,"danger");
                    }else{
                        ui.addUserToUIFromGithubApi(userDataFromGithub,reposDataFromGithub,isHave,userIdFromJsonApi);
                        ui.messageCard(`User <b>${userDataFromGithub.login}</b> found successfully!`,"success");
                        searchInput.classList.remove("is-invalid");
                    }
                })
                .catch(err=>console.log(err));
            }
            ui.clearInput();
        })
        .catch(err=>console.log(err));
    }
    e.preventDefault();
}

function goHome(){
    ui.goHomeToUI();
}

function addFavoritesForClick(e){
    ui.addUserToFavorites(e.target);
}

function getFavoriteUsers(){
    jsonRestApi.getFavoriteUsers()
    .then(usersDataFromJsonApi=>{
        ui.addUsersToUIFromJsonApi(usersDataFromJsonApi);
    })
    .catch(err=>console.log(err));
}

(function favoriteUsersCount(){
    jsonRestApi.getFavoriteUsers().then(
        usersDataFromJsonApi=>favoritesBadge.innerHTML = usersDataFromJsonApi.length
    );
})();