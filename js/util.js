export async function sleep(timeout)
{
    return new Promise(resolve => setTimeout(resolve, timeout));
}
export function $(selector)
{
    return document.querySelector(selector)
}
export function $$(selector)
{
    return document.querySelectorAll(selector)
}
export async function popupInfo(message, timeout = 3000, type = "info", options = {})
{
    const existingPopup = $(".global-popup");
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement("div");
    popup.classList.add("global-popup", "popup-" + type);
    popup.innerText = message;

    if (options["position"]) {
        const rules = {
            "top": "bottom: 82% !important;",
            "bottom": "bottom: 5% !important;",
            "center": "right: 50% !important;transform: translateX(50%)",
            "right": "right: 5% !important;",
            "left": "right: unset !important;left: 5% !important"
        };
        
        const positions = options["position"].split("-");
        const css = `${rules[positions[0]]};${rules[positions[1]]};`;
        popup.setAttribute("style", css);
    }

    if (options["text-align"])
    {
        popup.style.textAlign = options["text-align"];
    }

    document.body.appendChild(popup);
    await sleep(timeout);
    popup.remove();
}
export function markdownToHTML(md)
{
    
}