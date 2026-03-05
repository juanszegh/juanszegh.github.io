const component_style = new CSSStyleSheet()
const global_style = new CSSStyleSheet()

fetch("css/components/ProjectCard.css").then(res => res.text()).then(css => component_style.replaceSync(css))
fetch("css/global.css").then(res => res.text()).then(css => global_style.replaceSync(css))

export class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [component_style, global_style]
        this.classList.add("hollow-card")
        this.renderDetails()
        this.renderTechs()
    }
    renderDetails()
    {
        // Thumbnail

        const thumbnail_wrapper = document.createElement("div")
        thumbnail_wrapper.id = "thumbnail_wrapper"

        const gradient = document.createElement("div")
        gradient.id = "gradient"
        thumbnail_wrapper.appendChild(gradient)

        const path = this.querySelector("thumbnail").textContent
        const thumbnail = document.createElement("img")
        thumbnail.src = path
        thumbnail_wrapper.appendChild(thumbnail)

        // Container

        const details_container = document.createElement("div")
        details_container.id = "details_container"

        // Name
        const title = this.querySelector("name").textContent
        const title_element = document.createElement("h3")
        title_element.textContent = title
        thumbnail_wrapper.appendChild(title_element)

        // Description
        const description = this.querySelector("description").textContent
        const description_element = document.createElement("p")
        description_element.className = "project-description"
        description_element.textContent = description
        details_container.appendChild(description_element)

        this.shadowRoot.appendChild(thumbnail_wrapper)
        this.shadowRoot.appendChild(details_container)
    }
    renderTechs()
    {
        const techs = this.querySelectorAll("tech")
        const container = document.createElement("div")
        container.id = "tech_stack_container"

        techs.forEach(t => {
            const item = document.createElement("div")
            item.className = "tech-item"
            const p = document.createElement("p")
            p.textContent = t.textContent
            item.appendChild(p)
            container.appendChild(item)
        })

        this.shadowRoot.querySelector("#details_container").appendChild(container)
    }
}