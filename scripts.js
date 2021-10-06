const setCookie = () => {
    document.cookie="oldsmobile=1";
    formSubmit();
};

const formSubmit = () => {
    window.open(`/service/${encodeURIComponent(("https://" + document.getElementById("urlBar").value.replace("https://", "").replace("http://", "")).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''))}`)
}
