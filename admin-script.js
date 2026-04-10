const ADMIN_PASSWORD = "zetsu2024";

let currentEditMember = null;

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('photoUpload');
    const imagePreview = document.getElementById('imagePreview');
    const avatarInput = document.getElementById('newMemberAvatar');
    
    if (!uploadArea) return;
    
    uploadArea.onclick = () => fileInput.click();
    
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const base64 = await imageToBase64(file);
            avatarInput.value = base64;
            imagePreview.innerHTML = `<img src="${base64}" alt="Aperçu">`;
        }
    };
    
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255,215,0,0.2)';
    };
    
    uploadArea.ondragleave = () => {
        uploadArea.style.background = 'rgba(255,215,0,0.05)';
    };
    
    uploadArea.ondrop = async (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255,215,0,0.05)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const base64 = await imageToBase64(file);
            avatarInput.value = base64;
            imagePreview.innerHTML = `<img src="${base64}" alt="Aperçu">`;
        }
    };
}

function setupEditImageUpload() {
    const uploadArea = document.getElementById('editUploadArea');
    const fileInput = document.getElementById('editPhotoUpload');
    const imagePreview = document.getElementById('editImagePreview');
    const avatarInput = document.getElementById('editAvatar');
    
    if (!uploadArea) return;
    
    uploadArea.onclick = () => fileInput.click();
    
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const base64 = await imageToBase64(file);
            avatarInput.value = base64;
            imagePreview.innerHTML = `<img src="${base64}" alt="Aperçu">`;
        }
    };
}

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

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadAllMembers();
    setupImageUpload();
    setupEditImageUpload();
}

function logout() {
    localStorage.removeItem('zetsuAdminLoggedIn');
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function loadMembersData() {
    const saved = localStorage.getItem('clanZetsuData');
    if (saved) {
        return JSON.parse(saved);
    }
    return { chefs: [], sousChefs: [], soldats: [] };
}

function saveMembersData(data) {
    localStorage.setItem('clanZetsuData', JSON.stringify(data));
    if (window.opener) {
        window.opener.refreshDisplay();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createMemberItem(member, rank, index) {
    const div = document.createElement('div');
    div.className = 'member-item';
    
    const getInitials = (name) => {
        const match = name.match(/[A-Za-z\u00C0-\u00FF]/);
        return match ? match[0].toUpperCase() : 'Z';
    };
    
    let avatarHtml = '';
    if (member.avatar && member.avatar !== '') {
        avatarHtml = `<img src="${member.avatar}" alt="${member.name}">`;
    } else {
        avatarHtml = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${getInitials(member.name)}</div>`;
    }
    
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

function loadAllMembers() {
    const data = loadMembersData();
    
    const chefsList = document.getElementById('chefsList');
    chefsList.innerHTML = '';
    data.chefs.forEach((chef, index) => {
        chefsList.appendChild(createMemberItem(chef, 'chef', index));
    });
    
    const sousChefsList = document.getElementById('sousChefsList');
    sousChefsList.innerHTML = '';
    data.sousChefs.forEach((sousChef, index) => {
        sousChefsList.appendChild(createMemberItem(sousChef, 'souschef', index));
    });
    
    const soldatsList = document.getElementById('soldatsList');
    soldatsList.innerHTML = '';
    data.soldats.forEach((soldat, index) => {
        soldatsList.appendChild(createMemberItem(soldat, 'soldat', index));
    });
}

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
    
    const preview = document.getElementById('editImagePreview');
    if (member.avatar && member.avatar !== '') {
        preview.innerHTML = `<img src="${member.avatar}" alt="Aperçu">`;
    } else {
        preview.innerHTML = '';
    }
    
    document.getElementById('editModal').style.display = 'block';
    setupEditImageUpload();
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditMember = null;
}

function saveEdit() {
    if (!currentEditMember) return;
    
    const newName = document.getElementById('editName').value.trim();
    const newAvatar = document.getElementById('editAvatar').value;
    
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

function addMember() {
    const name = document.getElementById('newMemberName').value.trim();
    const rank = document.getElementById('newMemberRank').value;
    const avatar = document.getElementById('newMemberAvatar').value;
    
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
    
    document.getElementById('newMemberName').value = '';
    document.getElementById('newMemberAvatar').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('photoUpload').value = '';
    
    alert('Membre ajouté avec succès!');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    const buttons = document.querySelectorAll('.tab-btn');
    const tabMap = { chefs: 0, souschefs: 1, soldats: 2, add: 3 };
    if (buttons[tabMap[tabName]]) {
        buttons[tabMap[tabName]].classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('zetsuAdminLoggedIn') === 'true';
    if (isLoggedIn) {
        showDashboard();
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
