function createCards(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    skills.forEach(skill => {
        const card = document.createElement("pre");
        card.classList.add("skill-card");

        const padding = 2;
        const contentWidth = skill.length + padding * 2;
        const topBottom = "+" + "-".repeat(contentWidth) + "+";
        const middle = "|" + " ".repeat(padding) + skill + " ".repeat(padding) + "|";

        card.textContent = `${topBottom}\n${middle}\n${topBottom}`;
        container.appendChild(card);
    });
}
