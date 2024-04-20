// Ketika DOM sudah dimuat sepenuhnya, jalankan kode berikut
document.addEventListener("DOMContentLoaded", function () {
    // Tentukan kunci untuk menyimpan data rak buku di local storage
    const BOOKSHELF_KEY = "bookshelf";

    // Fungsi untuk memperbarui tampilan rak buku
    function refreshBookshelf(filteredBooks = null) {
        // Dapatkan elemen rak buku yang belum selesai dan selesai dari HTML
        const incompleteBookshelfList = document.getElementById(
            "incompleteBookshelfList"
        );
        const completeBookshelfList = document.getElementById(
            "completeBookshelfList"
        );

        // Kosongkan isi rak buku sebelum memperbarui
        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        // Ambil data rak buku dari local storage atau inisialisasi jika belum ada
        const storedBookshelf =
            JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];

        // Tentukan daftar buku yang akan ditampilkan (bisa berupa seluruh rak buku atau hasil filter)
        const booksToDisplay = filteredBooks ? filteredBooks : storedBookshelf;

        // Tampilkan setiap buku dalam rak buku sesuai dengan statusnya (selesai atau belum)
        booksToDisplay.forEach((book) => {
            const bookItem = createBookItem(book);

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }

    // Fungsi untuk membuat tampilan satu item buku
    function createBookItem(book) {
        // Buat elemen HTML untuk satu item buku
        const bookItem = document.createElement("article");
        bookItem.classList.add("card", "mb-3");

        // Buat elemen untuk menampilkan informasi buku
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Tampilkan judul buku
        const title = document.createElement("h3");
        title.classList.add("card-title");
        title.innerText = book.title;

        // Tampilkan nama penulis buku
        const author = document.createElement("p");
        author.classList.add("card-text");
        author.innerText = `Penulis: ${book.author}`;

        // Tampilkan tahun penerbitan buku
        const year = document.createElement("p");
        year.classList.add("card-text");
        year.innerText = `Tahun: ${book.year}`;

        // Buat tombol untuk mengubah status buku (selesai/belum)
        const action = document.createElement("div");
        action.classList.add("d-flex", "justify-content-between", "gap-2");

        const buttonMove = document.createElement("button");
        buttonMove.innerText = book.isComplete
            ? "Belum selesai dibaca"
            : "Selesai dibaca";
        buttonMove.classList.add(
            "btn",
            "btn-primary",
            "btn-sm",
            book.isComplete ? "bg-success" : "bg-success"
        );
        buttonMove.addEventListener("click", function () {
            // Tampilkan konfirmasi saat tombol diubah
            const confirmation = confirm(
                book.isComplete
                    ? "Apakah Anda yakin buku ini belum selesai dibaca?"
                    : "Apakah Anda yakin buku ini sudah selesai dibaca?"
            );
            if (confirmation) {
                toggleBookStatus(book.id);
            }
        });

        // Buat tombol untuk menghapus buku
        const buttonDelete = document.createElement("button");
        buttonDelete.innerText = "Hapus buku";
        buttonDelete.classList.add("btn", "btn-danger", "btn-sm");
        buttonDelete.addEventListener("click", function () {
            // Tampilkan konfirmasi saat buku dihapus
            const confirmation = confirm("Apakah Anda yakin ingin menghapus buku?");
            if (confirmation) {
                deleteBook(book.id);
            }
        });

        // Gabungkan elemen-elemen dalam satu item buku
        action.appendChild(buttonMove);
        action.appendChild(buttonDelete);

        cardBody.appendChild(title);
        cardBody.appendChild(author);
        cardBody.appendChild(year);
        cardBody.appendChild(action);

        bookItem.appendChild(cardBody);

        return bookItem;
    }

    // Fungsi untuk mengubah status buku (selesai/belum)
    function toggleBookStatus(bookId) {
        const storedBookshelf =
            JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
        const bookIndex = storedBookshelf.findIndex((book) => book.id == bookId);

        if (bookIndex !== -1) {
            // Toggle status buku dan simpan perubahan ke local storage
            storedBookshelf[bookIndex].isComplete =
                !storedBookshelf[bookIndex].isComplete;
            localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(storedBookshelf));
            // Perbarui tampilan rak buku
            refreshBookshelf();
        }
    }

    // Fungsi untuk menghapus buku dari rak buku
    function deleteBook(bookId) {
        let storedBookshelf = JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
        storedBookshelf = storedBookshelf.filter((book) => book.id != bookId);
        localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(storedBookshelf));
        // Perbarui tampilan rak buku setelah buku dihapus
        refreshBookshelf();
    }

    // Tambahkan event listener untuk form input buku
    const inputBookForm = document.getElementById("inputBook");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const bookSubmitButton = document.getElementById("bookSubmit");

    inputBookIsComplete.addEventListener("change", function () {
        // Perbarui teks tombol berdasarkan status checkbox
        if (inputBookIsComplete.checked) {
            bookSubmitButton.innerHTML =
                "Masukkan Buku ke rak <strong>Selesai dibaca</strong>";
        } else {
            bookSubmitButton.innerHTML =
                "Masukkan Buku ke rak <strong>Belum selesai dibaca</strong>";
        }
    });

    // Event listener untuk menambahkan buku ke rak buku
    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Ambil informasi buku dari form input
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        const isComplete = inputBookIsComplete.checked;
        const id = +new Date();

        // Buat objek buku baru
        const newBook = {
            id,
            title,
            author,
            year,
            isComplete,
        };

        // Ambil rak buku dari local storage atau inisialisasi jika belum ada
        let storedBookshelf = JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
        // Tambahkan buku baru ke rak buku
        storedBookshelf.push(newBook);
        localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(storedBookshelf));

        // Perbarui tampilan rak buku setelah buku ditambahkan
        refreshBookshelf();
        // Kosongkan form input setelah buku ditambahkan
        inputBookForm.reset();
        // Reset teks tombol setelah submit
        bookSubmitButton.innerText = "Masukkan Buku ke rak Belum Selesai dibaca";
    });

    // Event listener untuk form pencarian buku
    const searchBookForm = document.getElementById("searchBook");
    const searchBookTitleInput = document.getElementById("searchBookTitle");

    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Ambil kata kunci pencarian dari input
        const searchTerm = searchBookTitleInput.value.toLowerCase();
        // Lakukan pencarian buku berdasarkan judul
        searchBooks(searchTerm);
    });

    // Fungsi untuk melakukan pencarian buku berdasarkan judul
    function searchBooks(searchTerm) {
        const storedBookshelf =
            JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
        // Filter rak buku berdasarkan kata kunci pencarian
        const filteredBooks = storedBookshelf.filter((book) =>
            book.title.toLowerCase().includes(searchTerm)
        );

        // Perbarui tampilan rak buku dengan buku yang terfilter
        refreshBookshelf(filteredBooks);
    }

    // Saat halaman dimuat, perbarui tampilan rak buku
    refreshBookshelf();
});
