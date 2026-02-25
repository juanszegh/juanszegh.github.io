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
