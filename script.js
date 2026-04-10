// Données des membres
let membersData = {
    chefs: [
        { name: "Black Tobi zetsu", rank: "chef", avatar: "", id: "chef1" }
    ],
    sousChefs: [
        { name: "Poutine zetsu", rank: "souschef", avatar: "", id: "sous1" },
        { name: "Hinata zetsu", rank: "souschef", avatar: "", id: "sous2" },
        { name: "Henry zetsu", rank: "souschef", avatar: "", id: "sous3" },
        { name: "Quenn shensea zetsu", rank: "souschef", avatar: "", id: "sous4" }
    ],
    soldats: [
        { name: "Draken zetsu", rank: "soldat", avatar: "", id: "sol1" },
        { name: "Mr Naruto zetsu", rank: "soldat", avatar: "", id: "sol2" },
        { name: "Elyna zetsu", rank: "soldat", avatar: "", id: "sol3" },
        { name: "Shisui zetsu", rank: "soldat", avatar: "", id: "sol4" },
        { name: "𓆩 𝐀𝐁𝐘𝐒𝐒 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 𓆪 zetsu", rank: "soldat", avatar: "", id: "sol5" },
        { name: "⟁⃝𝐌𝐑✰𝐒𝐓𝐄𝐅𝐀𝐍ᶻᵉᵗˢᵘ ᵛᵉᵍᵉᵗᵃ", rank: "soldat", avatar: "", id: "sol6" },
        { name: "𝕊𝕙𝕒𝕕𝕠𝕨 Zetsu 𝐕𝐄𝐋𝐙𝐀𝐑𝐃 𝐙𝐄𝐓𝐒𝐔", rank: "soldat", avatar: "", id: "sol7" },
        { name: "𝐊𝐎𝐓𝐀𝐊𝐀ᶻᵉᵗˢᵘ", rank: "soldat", avatar: "", id: "sol8" },
        { name: "Ahmed zetsu", rank: "soldat", avatar: "", id: "sol9" },
        { name: "✦⃝🌹𝙰𝚕-𝙰𝚖𝚒𝚗𝚎 zetsu✦⃝🌹", rank: "soldat", avatar: "", id: "sol10" },
        { name: "Quenn laïcha zetsu", rank: "soldat", avatar: "", id: "sol11" },
        { name: "⟁⃝𝐌𝐑✰𝐃𝐄𝐌𝐎𝐍ᥫᩣ ˢᵃˡᵛᵃᵈᵒʳ zetsu", rank: "soldat", avatar: "", id: "sol12" }
    ]
};

// Charger les données depuis localStorage
function loadData() {
    const saved = localStorage.getItem('clanZetsuData');
    if (saved) {
        membersData = JSON.parse(saved);
    }
    updateTotalMembers();
}

// Sauvegarder les données
function saveData() {
    localStorage.setItem('clanZetsuData', JSON.stringify(membersData));
    updateTotalMembers();
}

// Mettre à jour le compteur total
function updateTotalMembers() {
    const total = membersData.chefs.length + membersData.sousChefs.length + membersData.soldats.length;
    const totalElement = document.getElementById('totalMembers');
    if (totalElement) {
        totalElement.textContent = total;
    }
}

// Créer une carte membre
function createMemberCard(member, rankType) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    const rankLabels = {
        chef: '👑 CHEF SUPRÊME',
        souschef: '⭐ SOUS-CHEF',
        soldat: '⚔️ SOLDAT'
    };
    
    const avatarHtml = member.avatar && member.avatar !== '' 
        ? `<img src="${member.avatar}" alt="${member.name}">`
        : `<div class="default-avatar">${getInitials(member.name)}</div>`;
    
    card.innerHTML = `
        <div class="member-avatar">
            ${avatarHtml}
        </div>
        <div class="member-name">${escapeHtml(member.name)}</div>
        <div class="member-rank">${rankLabels[rankType]}</div>
    `;
    
    return card;
}

// Obtenir les initiales
function getInitials(name) {
    const match = name.match(/[A-Za-z\u00C0-\u00FF]/);
    return match ? match[0].toUpperCase() : 'Z';
}

// Échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Afficher tous les membres
function displayMembers() {
    const chefsContainer = document.getElementById('chefsContainer');
    const sousChefsContainer = document.getElementById('sousChefsContainer');
    const soldatsContainer = document.getElementById('soldatsContainer');
    
    if (chefsContainer) {
        chefsContainer.innerHTML = '';
        membersData.chefs.forEach(chef => {
            chefsContainer.appendChild(createMemberCard(chef, 'chef'));
        });
    }
    
    if (sousChefsContainer) {
        sousChefsContainer.innerHTML = '';
        membersData.sousChefs.forEach(sousChef => {
            sousChefsContainer.appendChild(createMemberCard(sousChef, 'souschef'));
        });
    }
    
    if (soldatsContainer) {
        soldatsContainer.innerHTML = '';
        membersData.soldats.forEach(soldat => {
            soldatsContainer.appendChild(createMemberCard(soldat, 'soldat'));
        });
    }
}

// Gestion de la musique
let audio = null;
let isPlaying = false;

function initAudio() {
    audio = document.getElementById('bgVideo');
    if (audio) {
        audio.volume = 0.3;
        const audioBtn = document.getElementById('audioBtn');
        
        audioBtn.addEventListener('click', () => {
            if (audio.muted) {
                audio.muted = false;
                audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                audio.muted = true;
                audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }
}

// Navigation mobile
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Vérifier si admin est connecté
function checkAdminAccess() {
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        const isAdmin = localStorage.getItem('zetsuAdminLoggedIn') === 'true';
        if (isAdmin) {
            adminBtn.classList.add('visible');
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    displayMembers();
    initAudio();
    initMobileNav();
    checkAdminAccess();
    
    // Ajouter le bouton admin
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminBtn';
    adminBtn.className = 'admin-panel-btn';
    adminBtn.innerHTML = '<i class="fas fa-user-shield"></i>';
    adminBtn.onclick = () => {
        window.location.href = 'admin.html';
    };
    document.body.appendChild(adminBtn);
    checkAdminAccess();
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
