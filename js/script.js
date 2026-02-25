import { sleep, $, $$ } from "./util.js"

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
            for (let i = 0; i < n.children.length; i++) {
                n.children[i].innerText = translation[i]
            }
            return
        }
        else if (typeof translation === "string")
        {
            node.innerText = translation
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


document.addEventListener("DOMContentLoaded", () => {
    $("#ddl_language").addEventListener("change", (e) => {
        changeLanguage(e.target.value)
    })
});

