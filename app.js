
document.addEventListener("DOMContentLoaded", function() {
    let username;
    let currentPage = 1;
    let perPage = 10;

    function getUsername() {
        username = document.querySelector("#username").value.trim();
        if (!username) {
            alert("Username cannot be empty. Please enter a valid GitHub username.");
            return false;
        }
        return true;
    }

    function displayLoader() {
        document.querySelector("#loader").style.display = "block";
    }

    function hideLoader() {
        document.querySelector("#loader").style.display = "none";
    }

    function displayUserProfile(user) {
        const userProfileContainer = document.querySelector("#userProfile");
        userProfileContainer.innerHTML = "";

        const userProfileHTML = `
            <div class="user-details">
                <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || "No bio available"}</p>
                <p>Followers: ${user.followers}</p>
                <p>Following: ${user.following}</p>
                <p>Public Repositories: ${user.public_repos}</p>
            </div>
        `;
        userProfileContainer.innerHTML = userProfileHTML;
    }

    function displayRepositories(repositories) {
        const repositoriesContainer = document.querySelector("#repositories");
        repositoriesContainer.innerHTML = "";

        repositories.forEach(repository => {
            const repositoryHTML = `
                <div class="repository">
                    <h2>${repository.name}</h2>
                    <p>${repository.description}</p>
                    <p>Topics: ${repository.topics.join(', ')}</p>
                </div>
            `;
            repositoriesContainer.innerHTML += repositoryHTML;
            
        });
    }

    function displayPagination(totalPages) {
        const paginationContainer = document.querySelector("#pagination");
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? "active" : "";
            const pageHTML = `<a href="#" class="${activeClass}" data-page="${i}">${i}</a>`;
            paginationContainer.innerHTML += pageHTML;
        }
    }

    function filterRepositories(repositories, searchTerm) {
        return repositories.filter(repository => repository.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    function fetchData() {
        if (!getUsername()) {
            return;
        }

        displayLoader();

        const userApiUrl = `https://api.github.com/users/${username}`;
        const repositoriesApiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`;

        Promise.all([
            fetch(userApiUrl).then(response => response.json()),
            fetch(repositoriesApiUrl).then(response => response.json())
        ]).then(function([user, repositories]) {
            hideLoader();

            displayUserProfile(user);

            const searchTerm = document.querySelector("#repoSearch").value.trim();
            
            const filteredRepositories = searchTerm ? filterRepositories(repositories, searchTerm) : repositories;

            displayRepositories(filteredRepositories);

            const totalPages = Math.ceil(filteredRepositories.length / perPage);
            displayPagination(totalPages);
        });
    }

    document.querySelector("#searchBtn").addEventListener("click", function() {
        fetchData();
    });

    document.querySelector("#homeBtn").addEventListener("click", function() {
        document.querySelector("#userProfile").innerHTML = "";
        document.querySelector("#repositories").innerHTML = "";
        document.querySelector("#pagination").innerHTML = "";
        document.querySelector("#username").value = ""; 
    });

 
    document.querySelector("#pagination").addEventListener("click", function(e) {
        if (e.target.tagName === "A") {
            e.preventDefault();
            currentPage = parseInt(e.target.dataset.page);
            fetchData();
        }
    });

 
    document.querySelector("#perPage").addEventListener("change", function() {
        perPage = parseInt(document.querySelector("#perPage").value);
        currentPage = 1;
        fetchData();
    });
});
