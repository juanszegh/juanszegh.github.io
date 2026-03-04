import { sleep, $, $$ } from "./util.js"
import { TechStack } from "./components/TechStack.js"
import { ProjectCard } from "./components/ProjectCard.js"

customElements.define("tech-stack", TechStack);
customElements.define("project-card", ProjectCard);

async function applyTranslation(selector, translation)
{
    const nodes = $$(selector);
    if (nodes.length === 0) 
    {
        console.warn(`No node with selector '${selector}' was found`)
        return
    }
    nodes.forEach(n => {
        if (Array.isArray(translation))
        {
            for (let i = 0; i < translation.length; i++) {
                n.children[i].innerText = translation[i]
            }
            return
        }
        else if (typeof translation === "string")
        {
            if (translation !== "*")
            {
                node.innerText = translation
            }
            return
        }
        console.warn(`Invalid text format for selector '${selector}'`)
    })
}

async function changeLanguage(language)
{
    if (typeof language !== "string") return

    const response = await fetch(`../lang/${language}.json`)
    if (!response.ok) return

    const language_pack = await response.json()
    const selectors = Object.keys(language_pack)

    if (selectors.length === 0)
    {
        // Default to english
        changeLanguage("en")
        return    
    }

    selectors.forEach(k => {
        const translation = language_pack[k]
        if (translation === undefined)
        {
            console.warn(`Translation not found for node '${k}'`);
        }
        else
        {
            applyTranslation(k,translation) 
        }
    })
}

async function formRequestHandler()
{
    const form = document.getElementById('contact_form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form_data = new FormData(form);

        try 
        {
            const response = await fetch("https://formspree.io/f/xkovekzp", {
                method: "POST",
                body: form_data,
                headers: { 'Accept': 'application/json'}
            });
            if (response.ok) 
            {
                form.reset();
            } 
            else 
            {
                // popup error message
            }
        } 
        catch (error) 
        {
            // popup error message
            console.error("Error submitting form:", error);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    formRequestHandler()
    $("#ddl_language").addEventListener("change", (e) => {
        changeLanguage(e.target.value)
    })
});