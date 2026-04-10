// Données par défaut
const defaultMembersData = {
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

function loadData() {
    const saved = localStorage.getItem('clanZetsuData');
    if (saved) {
        return JSON.parse(saved);
    } else {
        saveData(defaultMembersData);
        return defaultMembersData;
    }
}

function saveData(data) {
    localStorage.setItem('clanZetsuData', JSON.stringify(data));
}

function updateTotalMembers(data) {
    const total = data.chefs.length + data.sousChefs.length + data.soldats.length;
    const totalElement = document.getElementById('totalMembers');
    if (totalElement) totalElement.textContent = total;
}

function getInitials(name) {
    const match = name.match(/[A-Za-z\u00C0-\u00FF]/);
    return match ? match[0].toUpperCase() : 'Z';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createMemberCard(member, rankType) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    const rankLabels = {
        chef: '👑 CHEF SUPRÊME',
        souschef: '⭐ SOUS-CHEF',
        soldat: '⚔️ SOLDAT'
    };
    
    let avatarHtml = '';
    if (member.avatar && member.avatar !== '') {
        avatarHtml = `<img src="${member.avatar}" alt="${member.name}">`;
    } else {
        avatarHtml = `<div class="default-avatar">${getInitials(member.name)}</div>`;
    }
    
    card.innerHTML = `
        <div class="member-avatar">${avatarHtml}</div>
        <div class="member-name">${escapeHtml(member.name)}</div>
        <div class="member-rank">${rankLabels[rankType]}</div>
    `;
    
    return card;
}

function displayMembers() {
    const data = loadData();
    
    const chefsContainer = document.getElementById('chefsContainer');
    const sousChefsContainer = document.getElementById('sousChefsContainer');
    const soldatsContainer = document.getElementById('soldatsContainer');
    
    if (chefsContainer) {
        chefsContainer.innerHTML = '';
        data.chefs.forEach(chef => {
            chefsContainer.appendChild(createMemberCard(chef, 'chef'));
        });
    }
    
    if (sousChefsContainer) {
        sousChefsContainer.innerHTML = '';
        data.sousChefs.forEach(sousChef => {
            sousChefsContainer.appendChild(createMemberCard(sousChef, 'souschef'));
        });
    }
    
    if (soldatsContainer) {
        soldatsContainer.innerHTML = '';
        data.soldats.forEach(soldat => {
            soldatsContainer.appendChild(createMemberCard(soldat, 'soldat'));
        });
    }
    
    updateTotalMembers(data);
}

// Audio
let audio = null;

function initAudio() {
    audio = document.getElementById('bgAudio');
    if (audio) {
        audio.volume = 0.3;
        audio.loop = true;
        
        const audioBtn = document.getElementById('audioBtn');
        
        const attemptPlay = () => {
            audio.play().catch(() => {});
            document.removeEventListener('click', attemptPlay);
            document.removeEventListener('touchstart', attemptPlay);
        };
        
        document.addEventListener('click', attemptPlay);
        document.addEventListener('touchstart', attemptPlay);
        
        if (audioBtn) {
            audioBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (audio.paused) {
                    audio.play();
                    audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                } else {
                    audio.pause();
                    audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                }
            });
        }
    }
}

// Navigation mobile
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }
}

// Navigation active
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('.nav-link, .hero-btn').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Admin button
function initAdminButton() {
    if (document.getElementById('adminBtn')) return;
    
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminBtn';
    adminBtn.className = 'admin-btn';
    adminBtn.innerHTML = '<i class="fas fa-user-shield"></i>';
    adminBtn.onclick = () => {
        window.location.href = 'admin.html';
    };
    document.body.appendChild(adminBtn);
}

window.refreshDisplay = function() {
    displayMembers();
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayMembers();
    initAudio();
    initMobileNav();
    initActiveNav();
    initSmoothScroll();
    initAdminButton();
});
