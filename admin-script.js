// Vérifiez que ces fonctions existent dans admin-script.js :

function loadMembersData() {
    const saved = localStorage.getItem('clanZetsuData');
    if (saved) {
        return JSON.parse(saved);
    }
    return { chefs: [], sousChefs: [], soldats: [] };
}

function saveMembersData(data) {
    localStorage.setItem('clanZetsuData', JSON.stringify(data));
    // Rafraîchir la page principale si elle est ouverte
    if (window.opener) {
        window.opener.refreshDisplay();
    }
}
