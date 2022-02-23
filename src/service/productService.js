
const PRODUCTS_API_URL = "https://api.dnabil.ovh/products";

export const getProducts = () => {
    return fetch(PRODUCTS_API_URL, {
        method: "GET"
    });
};

export const createProduct = (produit) => {
    return fetch(PRODUCTS_API_URL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produit)
    });
};

export const updateProduct = (produit) => {
    return fetch(`${PRODUCTS_API_URL}/${produit.id}`, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produit)
    });
};


export const deleteProduct = (produit) => {
    return fetch(`${PRODUCTS_API_URL}/${produit.id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};