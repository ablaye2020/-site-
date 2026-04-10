// Mot de passe admin (changez-le!)
const ADMIN_PASSWORD = "zetsu2024";

let currentEditMember = null;
let currentEditRank = null;

// Vérifier le mot de passe
function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('errorMsg');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('zetsuAdminLoggedIn', 'true');
        showDashboard();
    } else {
        errorMsg.textContent = 'Mot de passe incorrect!';
    }
}

// Afficher le dashboard
function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadAllMembers();
}

// Déconnexion
function logout() {
    localStorage.removeItem('zetsuAdminLoggedIn');
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

// Charger les membres depuis localStorage
function loadMembersData() {
    const saved = localStorage.getItem('clanZetsuData');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        chefs: [],
        sousChefs: [],
        soldats: []
    };
}

// Sauvegarder les membres
function saveMembersData(data) {
    localStorage.setItem('clanZetsuData', JSON.stringify(data));
}

// Charger et afficher tous les membres
function loadAllMembers() {
    const data = loadMembersData();
    
    // Afficher les chefs
    const chefsList = document.getElementById('chefsList');
    chefsList.innerHTML = '';
    data.chefs.forEach((chef, index) => {
        chefsList.appendChild(createMemberItem(chef, 'chef', index));
    });
    
    // Afficher les sous-chefs
    const sousChefsList = document.getElementById('sousChefsList');
    sousChefsList.innerHTML = '';
    data.sousChefs.forEach((sousChef, index) => {
        sousChefsList.appendChild(createMemberItem(sousChef, 'souschef', index));
    });
    
    // Afficher les soldats
    const soldatsList = document.getElementById('soldatsList');
    soldatsList.innerHTML = '';
    data.soldats.forEach((soldat, index) => {
        soldatsList.appendChild(createMemberItem(soldat, 'soldat', index));
    });
}

// Créer un élément membre pour l'admin
function createMemberItem(member, rank, index) {
    const div = document.createElement('div');
    div.className = 'member-item';
    
    const getInitials = (name) => {
        const match = name.match(/[A-Za-z\u00C0-\u00FF]/);
        return match ? match[0].toUpperCase() : 'Z';
    };
    
    const avatarHtml = member.avatar && member.avatar !== ''
        ? `<img src="${member.avatar}" alt="${member.name}" onerror="this.src=''">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${getInitials(member.name)}</div>`;
    
    div.innerHTML = `
        <div class="member-info">
            <div class="member-avatar-preview">
                ${avatarHtml}
            </div>
            <div class="member-name-display">${escapeHtml(member.name)}</div>
        </div>
        <button class="edit-member-btn" onclick="openEditModal('${rank}', ${index})">
            <i class="fas fa-edit"></i> Modifier
        </button>
    `;
    
    return div;
}

// Échapper HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ouvrir le modal d'édition
function openEditModal(rank, index) {
    const data = loadMembersData();
    let member;
    
    if (rank === 'chef') {
        member = data.chefs[index];
    } else if (rank === 'souschef') {
        member = data.sousChefs[index];
    } else {
        member = data.soldats[index];
    }
    
    currentEditMember = { rank, index, member };
    
    document.getElementById('editName').value = member.name;
    document.getElementById('editAvatar').value = member.avatar || '';
    document.getElementById('editModal').style.display = 'block';
}

// Fermer le modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditMember = null;
}

// Sauvegarder les modifications
function saveEdit() {
    if (!currentEditMember) return;
    
    const newName = document.getElementById('editName').value.trim();
    const newAvatar = document.getElementById('editAvatar').value.trim();
    
    if (!newName) {
        alert('Le nom ne peut pas être vide!');
        return;
    }
    
    const data = loadMembersData();
    const { rank, index } = currentEditMember;
    
    if (rank === 'chef') {
        data.chefs[index].name = newName;
        data.chefs[index].avatar = newAvatar;
    } else if (rank === 'souschef') {
        data.sousChefs[index].name = newName;
        data.sousChefs[index].avatar = newAvatar;
    } else {
        data.soldats[index].name = newName;
        data.soldats[index].avatar = newAvatar;
    }
    
    saveMembersData(data);
    loadAllMembers();
    closeModal();
}

// Supprimer un membre
function deleteMember() {
    if (!currentEditMember) return;
    if (!confirm('Voulez-vous vraiment supprimer ce membre?')) return;
    
    const data = loadMembersData();
    const { rank, index } = currentEditMember;
    
    if (rank === 'chef') {
        data.chefs.splice(index, 1);
    } else if (rank === 'souschef') {
        data.sousChefs.splice(index, 1);
    } else {
        data.soldats.splice(index, 1);
    }
    
    saveMembersData(data);
    loadAllMembers();
    closeModal();
}

// Ajouter un membre
function addMember() {
    const name = document.getElementById('newMemberName').value.trim();
    const rank = document.getElementById('newMemberRank').value;
    const avatar = document.getElementById('newMemberAvatar').value.trim();
    
    if (!name) {
        alert('Veuillez entrer un nom!');
        return;
    }
    
    const data = loadMembersData();
    const newMember = { name, rank, avatar, id: Date.now().toString() };
    
    if (rank === 'chef') {
        data.chefs.push(newMember);
    } else if (rank === 'souschef') {
        data.sousChefs.push(newMember);
    } else {
        data.soldats.push(newMember);
    }
    
    saveMembersData(data);
    loadAllMembers();
    
    // Réinitialiser le formulaire
    document.getElementById('newMemberName').value = '';
    document.getElementById('newMemberAvatar').value = '';
    
    alert('Membre ajouté avec succès!');
}

// Changer d'onglet
function showTab(tabName) {
    // Cacher tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Activer le bouton correspondant
    const buttons = document.querySelectorAll('.tab-btn');
    const tabMap = { chefs: 0, souschefs: 1, soldats: 2, add: 3 };
    if (buttons[tabMap[tabName]]) {
        buttons[tabMap[tabName]].classList.add('active');
    }
}

// Vérifier si déjà connecté au chargement
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('zetsuAdminLoggedIn') === 'true';
    if (isLoggedIn) {
        showDashboard();
    }
    
    // Fermer le modal en cliquant à l'extérieur
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
