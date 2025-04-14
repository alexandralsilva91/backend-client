const BACKEND_PATH = 'http://localhost:3001';

function populateFiltersOptions() {

    const typeSelect = document.getElementById("type");
    const brandSelect = document.getElementById("brand");

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`${BACKEND_PATH}/api/products/types`, requestOptions)
        .then((response) => response.json())
        .then((result) => (
            result.forEach(type => {

                typeSelect.insertAdjacentHTML("beforeend",
                    `<option value = "${type}">${type}</option>`
                )
            })
        ))

    fetch(`${BACKEND_PATH}/api/products/brands`, requestOptions)
        .then((response) => response.json())
        .then((result) => (
            result.forEach(brand => {

                brandSelect.insertAdjacentHTML("beforeend",
                    `<option value = "${brand}">${brand}</option>`
                )
            })
        ))

        .catch((error) => console.error(error));
}

populateFiltersOptions();

function handleFilterBtnClick() {
    const typeID = document.getElementById("type").value;
    const brandID = document.getElementById("brand").value;

    const queryParams = new URLSearchParams({
        type: typeID,
        brand: brandID
    }).toString();

    const url = `${BACKEND_PATH}/api/products?${queryParams}`;

    console.log(url);

    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            const productContainer = document.querySelector(".product-list");
            productContainer.innerHTML = "";
            result.forEach((product) => {
                let productElement = `<div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.brand}, ${product.type}</p>
                                <p class="card-text">${product.price}</p>
                                <p class="card-text"><small>${product.description}</small></p>
                                <button data-id="${product.id}" class="btn btn-danger delete-btn">Delete ${product.id}</button>
                            </div>
                        </div>
                    </div>`;

                productContainer.insertAdjacentHTML("beforeend", productElement);
            })

            const deleteBtns = document.querySelectorAll(".delete-btn");

            deleteBtns.forEach((deleteBtn) => {
                deleteBtn.addEventListener("click", handleDeleteProduct)
            });
        })
        .catch((error) => console.error(error));
}

function handleDeleteProduct(event) {
    const productID = event.target.dataset.id;

    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    fetch(`${BACKEND_PATH}/api/products/${productID}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error deleting product");
            }
            return response.json();
        })
        .then(() => {
            event.target.parentElement.parentElement.parentElement.remove();
        }).catch((error) => console.error(error));
}


handleFilterBtnClick();