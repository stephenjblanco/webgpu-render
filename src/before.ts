/*
export function compat_check(): boolean {
    const main_container: HTMLElement = <HTMLElement> document.getElementById("main-container");
    const info_container: HTMLElement = <HTMLElement> document.getElementById("info-container");
    const info_container_header: HTMLElement = <HTMLElement> document.getElementById("info-container-header");

    if (false) {
        main_container.style.display = "block";
        info_container.style.display = "none";
        info_container_header.style.display = "none";
        return true;
    } else {
        main_container.style.display = "none";
        info_container.style.display = "block";
        info_container_header.style.display = "block";
        info_container_header.innerText = "This browser does not support WebGPU.";
        return false;
    }
}

*/