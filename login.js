// Zaorinu example login screen javascript code

const clientId = 'Ov23liDydrs0YSmOnO9m';
const redirectUri = 'https://login-tests-six.vercel.app/api/callback';
const backendURL = 'https://login-tests-six.vercel.app';

const userDiv = document.getElementById('user');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.onclick = async () => {
    try {
    const stateRes = await fetch(`${backendURL}/api/state`);
    const stateData = await stateRes.json();
    const state = stateData.state;

    localStorage.setItem('oauth_state', state); // opcional: guardar p/ checagem futura

    const authURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    window.location.href = authURL;
    } catch (err) {
    console.error('Erro ao obter state:', err);
    alert('Erro ao iniciar login. Tente novamente.');
    }
};

logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    showLoggedOut();
};

function showLogged(username) {
    userDiv.textContent = `Hello, ${username}!`;
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
}

function showLoggedOut() {
    userDiv.textContent = 'You are not logged.';
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
}

async function validate(token) {
    const res = await fetch(`${backendURL}/api/validate`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
    });
    const data = await res.json();
    return data;
}

async function init() {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlState = params.get('state');

    if (urlToken && urlState) {
    // Salva o token no localStorage
    localStorage.setItem('token', urlToken);

    // Limpa a URL para remover os tokens expostos
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // Dá reload para inicializar app limpo
    window.location.reload();
    return; // Para evitar continuar execução antes do reload
    }

    const token = localStorage.getItem('token');
    if (token) {
    const data = await validate(token);
    if (data.valid) {
        showLogged(data.username);
    } else {
        showLoggedOut();
    }
    } else {
    showLoggedOut();
    }
}

init();