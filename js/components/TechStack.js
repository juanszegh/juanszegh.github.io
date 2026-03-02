export class TechStack extends HTMLElement
{
    categories = {
        "All" : [],
        "Backend" : [
            new TechItem("C#", "csharp.svg"),
            new TechItem("Node JS", "node.svg"),
            new TechItem("Python", "python.svg")
        ],
        "Frontend" : [
            new TechItem("HTML", "html.svg"),
            new TechItem("CSS", "css.svg"),
            new TechItem("React", "react.svg"),
            new TechItem("Angular", "angular.svg"),
            new TechItem("JavaScript", "js.svg")
        ],
        "Database" : [
            new TechItem("MySQL", "mysql.svg"),
            new TechItem("SQLite", "sqlite.svg")
        ],
        "Devops" : [
            new TechItem("Cloudflare", "cloudflare.svg"),
            new TechItem("Git", "git.svg")
        ]
    }
    constructor()
    {
        super()
        this.innerHTML = `
        <div class="flex">
            ${Object.keys(this.categories).map(k => `<div class="category-container"><p category="${k}">${k}</p></div>`).join("")}    
        </div>
        <div class="flex" id="tech_items_container">        
        </div>`
        this.querySelector("div.flex").addEventListener("click", (e) => {
            const category = e.target.getAttribute("category")
            if (!category) return

            const active_category = this.querySelector("p.active")
            if (active_category)
            {
                active_category.classList.remove("active")
            }
            
            const category_element = this.querySelector(`p[category="${category}"]`)
            category_element.classList.toggle("active")
            if (category === "All")
            {
                this.showAllCategories()
            }
            else
            {
                this.showCategory(this.categories[category])
            }
        })
        this.querySelector("p[category='All']").classList.add("active")
        this.showAllCategories()
    }
    showCategory(category)
    {
        const container = this.querySelector("#tech_items_container")
        container.innerHTML = "<div class='flex'></div>"
        category.forEach(c => {
            container.firstChild.appendChild(c.getElement())
        })
    }
    showAllCategories()
    {
        const container = this.querySelector("#tech_items_container")
        container.innerHTML = ""
        Object.keys(this.categories).forEach(category => {
            if (category === "All") return

            const category_container = document.createElement("div")
            category_container.className = "category-container"
            category_container.innerHTML = `<h5>${category}</h5>`

            const items_container = document.createElement("div")
            items_container.className = "flex"

            this.categories[category].forEach(c => {
                items_container.appendChild(c.getElement())
            })
            category_container.appendChild(items_container)
            container.appendChild(category_container)
        })
    }
}
class TechItem 
{
    constructor(name,icon)
    {
        this.name = name
        this.icon = icon
    }
    getElement()
    {
        const element = document.createElement("div")
        element.innerHTML = `
            <img src="assets/icons/tech/${this.icon}" alt="${this.name}" class="icon-medium">
            <p>${this.name}</p>`
        element.className = "tech-item flex hollow-card"
        return element
    }
}