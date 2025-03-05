"use strict";
function openNav(id) {
    const sidebar = document.getElementById(id);
    if (sidebar) {
        sidebar.style.display = "block";
    }
}
function closeNav(id) {
    const sidebar = document.getElementById(id);
    if (sidebar) {
        sidebar.style.display = "none";
    }
}
function openEditProfile(id1, id2, id3) {
    const userDetailDiv = document.getElementById(id1);
    userDetailDiv.style.display = "flex";
    const sidebar = document.getElementById(id2);
    sidebar.style.display = "none";
    const backdrop = document.getElementById(id3);
    backdrop.style.display = "block";
}
function closeEditProfile(id1, id2) {
    const userDetailDiv = document.getElementById(id1);
    if (userDetailDiv) {
        userDetailDiv.style.display = "none";
    }
    const backdrop = document.getElementById(id2);
    backdrop.style.display = "none";
}
