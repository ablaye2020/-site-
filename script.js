// Données par défaut avec likes
const defaultMembersData = {
    chefs: [
        { name: "Black Tobi zetsu", rank: "chef", avatar: "", likes: 0, id: "chef1" }
    ],
    sousChefs: [
        { name: "Poutine zetsu", rank: "souschef", avatar: "", likes: 0, id: "sous1" },
        { name: "Hinata zetsu", rank: "souschef", avatar: "", likes: 0, id: "sous2" },
        { name: "Henry zetsu", rank: "souschef", avatar: "", likes: 0, id: "sous3" },
        { name: "Quenn shensea zetsu", rank: "souschef", avatar: "", likes: 0, id: "sous4" }
    ],
    soldats: [
        { name: "Draken zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol1" },
        { name: "Mr Naruto zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol2" },
        { name: "Elyna zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol3" },
        { name: "Shisui zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol4" },
        { name: "𓆩 𝐀𝐁𝐘𝐒𝐒 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 𓆪 zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol5" },
        { name: "⟁⃝𝐌𝐑✰𝐒𝐓𝐄𝐅𝐀𝐍ᶻᵉᵗˢᵘ ᵛᵉᵍᵉᵗᵃ", rank: "soldat", avatar: "", likes: 0, id: "sol6" },
        { name: "𝕊𝕙𝕒𝕕𝕠𝕨 Zetsu 𝐕𝐄𝐋𝐙𝐀𝐑𝐃 𝐙𝐄𝐓𝐒𝐔", rank: "soldat", avatar: "", likes: 0, id: "sol7" },
        { name: "𝐊𝐎𝐓𝐀𝐊𝐀ᶻᵉᵗˢᵘ", rank: "soldat", avatar: "", likes: 0, id: "sol8" },
        { name: "Ahmed zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol9" },
        { name: "✦⃝🌹𝙰𝚕-𝙰𝚖𝚒𝚗𝚎 zetsu✦⃝🌹", rank: "soldat", avatar: "", likes: 0, id: "sol10" },
        { name: "Quenn laïcha zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol11" },
        { name: "⟁⃝𝐌𝐑✰𝐃𝐄𝐌𝐎𝐍ᥫᩣ ˢᵃˡᵛᵃᵈᵒʳ zetsu", rank: "soldat", avatar: "", likes: 0, id: "sol12" }
    ]
};

// Charger les données
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

// Gestion des likes
function loadLikedMembers() {
    const liked = localStorage.getItem('zetsuLikedMembers');
    return liked ? JSON.parse(liked) : [];
}

function saveLikedMembers(liked) {
    localStorage.setItem('zetsuLikedMembers', JSON.stringify(liked));
}

function hasUserLiked(memberId) {
    const liked = loadLikedMembers();
    return liked.includes(memberId);
}

function addUserLike(memberId) {
    const liked = loadLikedMembers();
    if (!liked.includes(memberId)) {
        liked.push(memberId);
        saveLikedMembers(liked);
    }
}

function removeUserLike(memberId) {
    let liked = loadLikedMembers();
    liked = liked.filter(id => id !== memberId);
    saveLikedMembers(liked);
}

function updateTotalLikes() {
    const data = loadData();
    const allMembers = [...data.chefs, ...data.sousChefs, ...data.soldats];
    const totalLikes = allMembers.reduce((sum, member) => sum + (member.likes || 0), 0);
    const totalLikesElement = document.getElementById('totalLikes');
    if (totalLikesElement) totalLikesElement.textContent = totalLikes;
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

// Like handler
function handleLike(memberId, rankType, index) {
    const data = loadData();
    let member;
    let memberList;
    
    if (rankType === 'chef') {
        memberList = data.chefs;
    } else if (rankType === 'souschef') {
        memberList = data.sousChefs;
    } else {
        memberList = data.soldats;
    }
    
    member = memberList[index];
    
    if (!member) return;
    
    const userLiked = hasUserLiked(memberId);
    
    if (userLiked) {
        // Unlike
        member.likes = Math.max(0, (member.likes || 0) - 1);
        removeUserLike(memberId);
    } else {
        // Like
        member.likes = (member.likes || 0) + 1;
        addUserLike(memberId);
    }
    
    saveData(data);
    displayMembers(); // Rafraîchir l'affichage
}

function createMemberCard(member, rankType, index) {
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
    
    const likes = member.likes || 0;
    const memberId = member.id;
    const userLiked = hasUserLiked(memberId);
    
    card.innerHTML = `
        <div class="member-avatar">${avatarHtml}</div>
        <div class="member-name">${escapeHtml(member.name)}</div>
        <div class="member-rank">${rankLabels[rankType]}</div>
        <div class="like-container">
            <button class="like-btn ${userLiked ? 'liked' : ''}" data-id="${memberId}" data-rank="${rankType}" data-index="${index}">
                <i class="fas fa-heart"></i>
                <span class="like-count">${likes}</span>
            </button>
        </div>
    `;
    
    // Attacher l'événement like
    const likeBtn = card.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = likeBtn.dataset.id;
            const rank = likeBtn.dataset.rank;
            const idx = parseInt(likeBtn.dataset.index);
            handleLike(id, rank, idx);
        });
    }
    
    return card;
}

function displayMembers() {
    const data = loadData();
    
    const chefsContainer = document.getElementById('chefsContainer');
    const sousChefsContainer = document.getElementById('sousChefsContainer');
    const soldatsContainer = document.getElementById('soldatsContainer');
    
    if (chefsContainer) {
        chefsContainer.innerHTML = '';
        data.chefs.forEach((chef, index) => {
            chefsContainer.appendChild(createMemberCard(chef, 'chef', index));
        });
    }
    
    if (sousChefsContainer) {
        sousChefsContainer.innerHTML = '';
        data.sousChefs.forEach((sousChef, index) => {
            sousChefsContainer.appendChild(createMemberCard(sousChef, 'souschef', index));
        });
    }
    
    if (soldatsContainer) {
        soldatsContainer.innerHTML = '';
        data.soldats.forEach((soldat, index) => {
            soldatsContainer.appendChild(createMemberCard(soldat, 'soldat', index));
        });
    }
    
    updateTotalMembers(data);
    updateTotalLikes();
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
