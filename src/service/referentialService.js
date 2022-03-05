
const REF_API_URL = "https://api.dnabil.ovh/referential/name";

export const getReferentialValues = (name) => {
    return fetch(`${REF_API_URL}/${name}`, {
        method: "GET"
    });
};