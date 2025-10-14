import { projects } from './projects.js';
let html='';
projects.forEach((project) => {
    html += `
        <div class="card" style="width: 18rem;">
            <img src="${project.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title roboto-slab-font">${project.name}</h5>
                <p class="card-text roboto-font">${project.about}</p>
                <a href="${project.githubLink}" target="_blank" class="roboto-font code-link">code</a>
                <a href="${project.websiteLink}" class="roboto-font website-link">website</a>
            </div>
        </div>
    `
})
document.querySelector('.projects-cards-flexbox').innerHTML = html;