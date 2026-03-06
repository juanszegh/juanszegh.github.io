import { sleep, $, $$, popupInfo } from "./util.js"
import { TechStack } from "./components/TechStack.js"
import { ProjectCard } from "./components/ProjectCard.js"

customElements.define("tech-stack", TechStack);
customElements.define("project-card", ProjectCard);

async function applyTranslation(selector, translation)
{
    let nodes;
    let multiple = false
    let attribute = ""
    if (selector.endsWith("*"))
    {
        selector = selector.slice(0, -1)
        multiple = true
    }
    if (selector.includes("/"))
    {
        const parts = selector.split("/")
        attribute = parts[1]
        selector = parts[0]
    }

    if (selector.startsWith("host:"))
    {
        const match = selector.match(/host:'(.*?)'/);
        const host_roots = Array.from(document.querySelectorAll(match[1])).map(n => n.shadowRoot)
        selector = selector.replace(/host:'(.*?)'/, "").trim()
        nodes = host_roots.map(root => Array.from(root.querySelectorAll(selector))).flat()
    }
    else
    {
        nodes = $$(selector);    
    }
    if (nodes.length === 0) 
    {
        console.warn(`No node with selector '${selector}' was found`)
        return
    }
    if (multiple && Array.isArray(translation))
    {
        for (let i = 0; i < nodes.length; i++) {
            if (attribute)
            {
                nodes[i].setAttribute(attribute, translation[i])    
            }
            else
            {
                nodes[i].innerText = translation[i]
            }
        }    
        return
    }
    nodes.forEach(n => {
        if (Array.isArray(translation))
        {
            for (let i = 0; i < translation.length; i++) {
                if (attribute)
                {
                    n.children[i].setAttribute(attribute, translation[i])    
                }
                else
                {
                    n.children[i].innerText = translation[i]
                }    
            }
            return
        }
        else if (typeof translation === "string")
        {
            if (translation == "*") return;

            if (attribute)
            {
                n.setAttribute(attribute, translation)
            }
            else 
            {
                n.innerText = translation
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
        form.querySelectorAll("input, textarea, button").forEach(input => input.disabled = true)
        form.querySelector("button").innerText = document.getElementById("sending_text").innerText

        const success_message = document.getElementById("success_text").innerText
        const error_message = document.getElementById("error_text").innerText
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
                popupInfo(success_message, 3000, "success", {"position": "bottom-right"})
            } 
            else 
            {
                popupInfo(error_message, 5000, "error", {"position": "bottom-right"})
            }
            form.querySelector("button").innerText = "Send Message"
        } 
        catch (error) 
        {
            popupInfo(error_message, 5000, "error", {"position": "bottom-right"})
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