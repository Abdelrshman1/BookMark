document.addEventListener("DOMContentLoaded", function () {
    const addBookmarkButton = document.getElementById("addBookmark");
    const bookmarkNameInput = document.getElementById("bookmarkName");
    const bookmarkURLInput = document.getElementById("bookmarkURL");
    const bookmarkTable = document.getElementById("bookmarkTable");

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    renderBookmarks();

    addBookmarkButton.addEventListener("click", function () {
        const name = bookmarkNameInput.value.trim();
        const url = bookmarkURLInput.value.trim();

        if (!validateInput(name, url)) {
            return;
        }

        const newBookmark = { name, url };
        bookmarks.push(newBookmark);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        renderBookmarks();
        bookmarkNameInput.value = "";
        bookmarkURLInput.value = "";
    });

    function validateInput(name, url) {
        let errorMessage = "";

        if (name.length < 3) {
            errorMessage += `<p>➡️ Site name must contain at least 3 characters</p>`;
        }

        const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;
        if (!urlPattern.test(url)) {
            errorMessage += `<p>➡️ Site URL must be a valid one</p>`;
        }

        if (errorMessage !== "") {
            showErrorPopup(errorMessage);
            return false;
        }

        return true;
    }

    function showErrorPopup(message) {
        const errorPopup = document.createElement("div");
        errorPopup.classList.add("error-popup");
        errorPopup.innerHTML = `
            <div class="error-content">
                <span class="close-btn">&times;</span>
                <h3> Site Name or URL is not valid</h3>
                ${message}
            </div>
        `;

        document.body.appendChild(errorPopup);

        document.querySelector(".close-btn").addEventListener("click", function () {
            document.body.removeChild(errorPopup);
        });
    }

    function renderBookmarks() {
        bookmarkTable.innerHTML = "";
        bookmarks.forEach((bookmark, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bookmark.name}</td>
                <td><a href="${bookmark.url}" target="_blank" class="visit-btn">Visit</a></td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            bookmarkTable.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                bookmarks.splice(index, 1);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                renderBookmarks();
            });
        });
    }
});
