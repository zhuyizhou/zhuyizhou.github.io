// 使用相同的团队成员数据
const teamMembers = {
    postdocs: [
        // ... 博士后数据
    ],
    phd_students: [
        {
            name: "Zihan Yan",
            photo: "images/yanzihan.jpg",
            year: "PhD Student",
            research: "First-principles calculations and machine learning molecular dynamics simulations",
            bio: "Zihan Yan is a PhD Student at Zhejiang University and Westlake University joint program. He received his Bachelor's degree at the College of Physics Science and Technology, Yangzhou University in 2023. His research focuses on first-principles calculations and machine learning molecular dynamics simulations. He has published several articles in journals like Energy Storage Mater., Chem. Mater., Nanoscale Horiz., Small, Mater. Des., etc."
        }
        // ... 其他学生数据
    ]
};

function renderDetailedPeople() {
    // 渲染学生详细信息
    const studentsGrid = document.querySelector('#students .people-grid');
    teamMembers.phd_students.forEach(student => {
        const detailedCard = document.createElement('div');
        detailedCard.className = 'detailed-member-card';
        detailedCard.innerHTML = `
            <div class="photo-container">
                <img src="${student.photo}" alt="${student.name}">
            </div>
            <div class="member-info">
                <h4>${student.name}</h4>
                <p class="position">${student.year}</p>
                <p class="research">${student.research}</p>
                <div class="bio">
                    <p>${student.bio}</p>
                </div>
            </div>
        `;
        studentsGrid.appendChild(detailedCard);
    });

    // 处理URL hash跳转
    if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

document.addEventListener('DOMContentLoaded', renderDetailedPeople); 