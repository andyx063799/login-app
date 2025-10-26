document.addEventListener('DOMContentLoaded', async () => {
    // - Hay que verificar si la sesion esta activa.
    const res = await fetch('/session');
    const data = await res.json();

    if (!data.logged) {
        // - Entonces si no esta logeado, redirigir al login.
        window.location.href = 'index.html';
        return;
    }

    // - Mostrar el nombre de usuario
    document.getElementById('welcome').textContent = `Hola, ${data.user}!`;

    // - Cerrar la sesion.
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const res = await fetch('/logout');
        const data = await res.json();
        alert(data.message);
        window.location.href = 'index.html';
    });
});