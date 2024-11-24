//Create, Update, and Manage Watchlist
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("movie-search");
    const searchBtn = document.getElementById("search-btn");
    const searchResults = document.getElementById("search-results");
    const customMovieInput = document.getElementById("custom-movie");
    const addCustomBtn = document.getElementById("add-custom-btn");
    const watchlist = document.getElementById("watchlist");

    let savedLists = {}; // Object to hold saved lists by name
    let currentListName = "";

    // add dropdown (in watchlist navigation) to allow user to load a saved list
    const titleSection = document.querySelector("#watchlist-section h2");
    const titleDropdown = document.createElement("select");
    titleDropdown.classList.add("dropdown-title");
    titleDropdown.style.marginLeft = "10px";
    const titleDefaultOption = document.createElement("option");
    titleDefaultOption.textContent = "Load a saved list";
    titleDefaultOption.disabled = true;
    titleDefaultOption.selected = true;
    titleDropdown.appendChild(titleDefaultOption);
    titleSection.after(titleDropdown);

    // Move dropdown next to "Add Movie" button
    //const customMovieRow = customMovieInput.parentElement; // Assuming it's the row container
    //customMovieRow.appendChild(titleDropdown);

    titleDropdown.addEventListener("change", () => {
        const selectedList = titleDropdown.value;
        if (selectedList && savedLists[selectedList]) {
            watchlist.innerHTML = ""; // Clear current watchlist
            watchlistSet.clear(); // Clear the set to avoid duplicate warnings
            savedLists[selectedList].forEach(movie => {
                addToWatchlist(movie, false); // Add movies without duplicate check
            });
            currentListName = selectedList;
        }
    });

    // add a "Save List" button next to "Your Watchlist"
    const saveListBtn = document.createElement("button");
    saveListBtn.textContent = "Save List";
    saveListBtn.style.marginLeft = "10px";
    saveListBtn.addEventListener("click", () => {
        const listName = prompt("Enter a name for your list:").trim();
        if (listName && !savedLists[listName]) {
            const currentList = Array.from(watchlist.children).map(li => li.querySelector("span").textContent);
            savedLists[listName] = currentList;
            currentListName = listName;
            updateDropdown();
            saveListsToFile();
            alert(`List '${listName}' saved successfully!`);
        } else {
            alert("Please enter a unique list name.");
        }
    });

    // Add a "Clear List" button so user can start over
    const clearListBtn = document.createElement("button");
    clearListBtn.textContent = "Clear List";
    clearListBtn.style.marginLeft = "10px";
    clearListBtn.addEventListener("click", () => {
        watchlist.innerHTML = "";
        watchlistSet.clear(); // Clear the set when clearing the list
        alert("Watchlist cleared!");
    });

    // Add a "Delete List" button so user can remove an old list
    const deleteListBtn = document.createElement("button");
    deleteListBtn.textContent = "Delete List";
    deleteListBtn.style.marginLeft = "10px";
    deleteListBtn.addEventListener("click", () => {
        if (currentListName && savedLists[currentListName]) {
            if (confirm(`Are you sure you want to delete the list '${currentListName}'?`)) {
                delete savedLists[currentListName];
                currentListName = "";
                watchlist.innerHTML = "";
                watchlistSet.clear();
                updateDropdown();
                saveListsToFile();
                alert("List deleted successfully!");
            }
        } else {
            alert("No list is currently loaded to delete.");
        }
    });

    // watch list section
    const watchlistHeading = document.querySelector("#watchlist-section h2");
    watchlistHeading.appendChild(saveListBtn);
    watchlistHeading.appendChild(clearListBtn);
    watchlistHeading.appendChild(deleteListBtn);
    watchlistHeading.appendChild(titleDropdown);



    const watchlistSet = new Set();

    //allow user to add movies to their watchlist
    function addToWatchlist(movie, checkDuplicates = true) {
        if (!checkDuplicates || !watchlistSet.has(movie)) {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";

            const movieName = document.createElement("span");
            movieName.textContent = movie;

            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "10px";

            //allow user to edit movie entry manually
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
                const newTitle = prompt("Enter a new title for the movie:", movieName.textContent);
                if (newTitle && newTitle.trim()) {
                    watchlistSet.delete(movieName.textContent);
                    movieName.textContent = newTitle.trim();
                    watchlistSet.add(movieName.textContent);
                }
            });

            //allow user to remove
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                watchlistSet.delete(movieName.textContent);
                li.remove();
            });

            //show edit buttons next to each movie in list
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(removeButton);

            li.appendChild(movieName);
            li.appendChild(buttonContainer);
            watchlist.appendChild(li);
            watchlistSet.add(movie);
        } else {
            alert("This movie is already in your watchlist!");
        }
    }

    //allow user to clear their movie database search results
    const clearSearchBtn = document.createElement("button");
    clearSearchBtn.textContent = "Clear Search Results";
    clearSearchBtn.style.display = "none";
    clearSearchBtn.style.marginLeft = "10px";
    clearSearchBtn.addEventListener("click", () => {
        searchResults.innerHTML = "";
        clearSearchBtn.style.display = "none";
    });

    //allow user to search drama movie database
    const searchControls = document.createElement("div");
    searchControls.style.display = "flex";
    searchControls.style.alignItems = "center";
    searchControls.style.gap = "10px";
    searchControls.appendChild(searchInput);
    searchControls.appendChild(searchBtn);
    searchControls.appendChild(clearSearchBtn); //not working --need to fix

    const searchSection = document.getElementById("search-section");
    searchSection.insertBefore(searchControls, searchResults);

    //search movie database and reveal one row per result
    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";

        if (query) {
            const filteredMovies = movies.filter(movie =>
                movie.toLowerCase().includes(query)
            );

            if (filteredMovies.length > 0) {
                filteredMovies.forEach(movie => {
                    const li = document.createElement("li");
                    li.style.display = "flex";
                    li.style.justifyContent = "space-between";
                    li.style.alignItems = "center";

                    const movieName = document.createElement("span");
                    movieName.textContent = movie;

                    const addButton = document.createElement("button");
                    addButton.textContent = "Add";
                    addButton.addEventListener("click", () => addToWatchlist(movie));

                    li.appendChild(movieName);
                    li.appendChild(addButton);
                    searchResults.appendChild(li);
                });
                clearSearchBtn.style.display = "inline-block";
            } else {
                searchResults.innerHTML = "<li>No results found</li>";
                clearSearchBtn.style.display = "inline-block";
            }
        }
    });

    //allows user to add a movie from search to watchlist
    addCustomBtn.addEventListener("click", () => {
        const customMovie = customMovieInput.value.trim();
        if (customMovie) {
            addToWatchlist(customMovie);
            customMovieInput.value = "";
        }
    });

    function updateDropdown() {
        titleDropdown.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Load a saved list";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        titleDropdown.appendChild(defaultOption);

        Object.keys(savedLists).forEach(listName => {
            const option = document.createElement("option");
            option.value = listName;
            option.textContent = listName;
            titleDropdown.appendChild(option);
        });
    }

    // allow user to save a watch list
    function saveListsToFile() {
        localStorage.setItem("savedLists", JSON.stringify(savedLists));
    }

    //allow user to select a previously saved watchlist
    function loadListsFromFile() {
        const storedLists = localStorage.getItem("savedLists");
        if (storedLists) {
            savedLists = JSON.parse(storedLists);
            updateDropdown();
        }
    }

    //load the watchlist selection dropdown
    loadListsFromFile();

});
