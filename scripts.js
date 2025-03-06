function openTab(tabName, event) {
    var i, tabContent, tabButtons;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

// Function to load project items from JSON files
async function loadProjectItems() {
    const tabs = ['websites', 'bots', 'tutorials', 'games'];
    
    for (const tab of tabs) {
        try {
            const response = await fetch(`tabs/${tab}/items.json`);
            if (!response.ok) {
                throw new Error(`Failed to load items for ${tab}`);
            }
            
            const items = await response.json();
            const tabContainer = document.getElementById(tab);
            
            // Clear existing content
            tabContainer.innerHTML = '';
            
            // Add each project item
            items.forEach(item => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                
                let externalLinkHtml = '';
                if (item.link) {
                    externalLinkHtml = `
                        <a href="${item.link}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg"
                            height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path color="#c4ebff" fill="#c4ebff"
                                d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                        </svg></a>
                    `;
                }
                
                projectItem.innerHTML = `
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 16l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
                        </svg>
                        ${item.title}
                        ${externalLinkHtml}
                    </h3>
                    <p class="date">${item.date}</p>
                    <ul>
                        ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                `;
                
                tabContainer.appendChild(projectItem);
            });
        } catch (error) {
            console.error(`Error loading ${tab} items:`, error);
        }
    }
}

// Load project items when the page loads
document.addEventListener('DOMContentLoaded', loadProjectItems);