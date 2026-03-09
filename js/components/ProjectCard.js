const component_style = new CSSStyleSheet()
const global_style = new CSSStyleSheet()
const media_query_style = new CSSStyleSheet()

fetch("css/components/ProjectCard.css").then(res => res.text()).then(css => component_style.replaceSync(css))
fetch("css/global.css").then(res => res.text()).then(css => global_style.replaceSync(css))
fetch("css/media_query.css").then(res => res.text()).then(css => media_query_style.replaceSync(css))

export class ProjectCard extends HTMLElement {

    ThumbnailPath = ""
    ProjectName = ""
    ProjectDescription = ""
    ProjectTechs = []
    DetailsPopup = null;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [component_style, global_style, media_query_style]

        this.classList.add("hollow-card")


        this.getProjectData()
        this.renderDescription()
        this.renderTechs()
   

    }
    getProjectData()
    {
        this.ThumbnailPath = this.querySelector("thumbnail").textContent
        this.ProjectName = this.querySelector("name").textContent
        this.ProjectDescription = this.querySelector("description").textContent
        this.ProjectTechs = Array.from(this.querySelectorAll("tech")).map(t => t.textContent)

        const details_element = this.querySelector("details")
        const project_details = Object.fromEntries(Array.from(details_element.children).map(c =>{
            return [c.tagName.toLowerCase(), c.innerHTML]
        }))
        this.DetailsPopup = new DetailsPopup(this.ProjectName,project_details,this)
    }
    renderDescription()
    {
        // Thumbnail

        const thumbnail_wrapper = document.createElement("div")
        thumbnail_wrapper.id = "thumbnail_wrapper"
        thumbnail_wrapper.addEventListener('click', () => this.DetailsPopup.open())
        
        const gradient = document.createElement("div")
        gradient.id = "gradient"
        thumbnail_wrapper.appendChild(gradient)

        const thumbnail = document.createElement("img")
        thumbnail.src = this.ThumbnailPath
        thumbnail_wrapper.appendChild(thumbnail)

        // Container

        const details_container = document.createElement("div")
        details_container.id = "details_container"

        // Name
        const title_element = document.createElement("h3")
        title_element.textContent = this.ProjectName
        thumbnail_wrapper.appendChild(title_element)

        // Description
        const description_element = document.createElement("p")
        description_element.className = "project-description"
        description_element.textContent = this.ProjectDescription
        details_container.appendChild(description_element)

        this.shadowRoot.appendChild(thumbnail_wrapper)
        this.shadowRoot.appendChild(details_container)
    }
    renderTechs()
    {
        const container = document.createElement("div")
        container.id = "tech_stack_container"

        this.ProjectTechs.forEach(t => {
            const item = document.createElement("div")
            item.className = "tech-item"
            const p = document.createElement("p")
            p.textContent = t
            item.appendChild(p)
            container.appendChild(item)
        })
        this.shadowRoot.querySelector("#details_container").appendChild(container)
    }
}
class DetailsPopup {

    Parent = null;

    constructor(project_name, project_details, parent)
    {
        this.Parent = parent

        const overlay = document.createElement("div")
        overlay.addEventListener('click', () => this.close())
        overlay.className = "details-overlay"
        overlay.style.display = "none"

        const popup = document.createElement("div")
        popup.className = "hollow-card details-popup"
        popup.innerHTML = `
            <h2>${project_name}</h2>
            <p class="project_concept">${project_details.concept}</p>
            <h2>The implementation</h2>
            <p class="project_implementation">${project_details.implementation}</p>
            <h2>My contribution</h2>
            <div class="project_contribution">${project_details.contribution}</div>
        `
        overlay.appendChild(popup)
        this.Parent.shadowRoot.appendChild(overlay)

    }
    open()
    {
        this.Parent.shadowRoot.querySelector(".details-overlay").style.display = "block"
    }
    close()
    {
        this.Parent.shadowRoot.querySelector(".details-overlay").style.display = "none"
    }
}