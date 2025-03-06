//CARREGA
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

function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Function to dynamically create tabs based on folders in the tabs directory
async function createDynamicTabs() {
    try {
        // Fetch the list of directories in the tabs folder
        const response = await fetch('tabs/');
        if (!response.ok) {
            throw new Error('Failed to fetch tabs directory');
        }
        
        const text = await response.text();
        //console.log("text: " + text);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Extract folder names from the directory listing
        const tabFolders = [];
        const links = doc.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                let folderName = href.trim();

                try {
                    folderName = folderName.split(/[/\\]/).filter(Boolean).pop().toLowerCase();
                } catch (error) {
                    try {
                        folderName = folderName.split(/[/\\]/).pop().toLowerCase();
                    } catch (error) {
                        try {
                            let parts = folderName.split(/[/\\]/).filter(Boolean);
                            folderName = parts.length > 0 ? parts.pop().toLowerCase() : folderName;
                        } catch (error) {
                            //mantem o valor original de foldername
                        }
                    }
                }

                const ignore = new Set(["tabs", "node-ecstatic","..",".",""]);
                if (!ignore.has(folderName)) {
                    tabFolders.push(folderName);
                }
            }
        });
        
        // If we couldn't get the directory listing, fall back to known tabs
        if (tabFolders.length === 0) {
            console.warn('Could not detect tab folders, falling back to default tabs');
            // return ['E1','websites', 'bots', 'tutorials', 'games'];
            return ['E1'];
        }
        return tabFolders;
    } catch (error) {
        console.error('Error creating dynamic tabs:', error);
        // Fallback to known tabs if there's an error
        // return ['E2','websites', 'bots', 'tutorials', 'games'];
        return ['E2'];
    }
}

// Function to create tab buttons and content containers
function createTabElements(tabs) {
    const projectSection = document.querySelector('.project-tabs').parentElement;
    
    // Clear existing tab buttons and content
    const existingTabsContainer = document.querySelector('.project-tabs');
    existingTabsContainer.innerHTML = '';
    
    // Remove existing tab content divs
    const existingTabContents = document.querySelectorAll('.tab-content');
    existingTabContents.forEach(tab => tab.remove());
    
    // Create new tab buttons
    tabs.forEach((tab, index) => {
        // Get just the folder name without the path
        const folderName = tab.replace(/^.*[\/]/, '');
        
        // Create tab button with first letter capitalized
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button' + (index === 0 ? ' active' : '');
        tabButton.onclick = function(event) { openTab(folderName, event); };
        const displayName = folderName.charAt(0).toUpperCase() + folderName.slice(1);
        tabButton.textContent = displayName;
        existingTabsContainer.appendChild(tabButton);
        
        // Create tab content container
        const tabContent = document.createElement('div');
        tabContent.id = folderName;
        tabContent.className = 'tab-content';
        tabContent.style.display = index === 0 ? 'block' : 'none';
        projectSection.appendChild(tabContent);
    });
    
    return tabs;
}

// Function to load project items from JSON files
async function loadProjectItems() {
    // Get dynamic tabs
    const tabs = await createDynamicTabs();
    
    // Create tab elements
    createTabElements(tabs);
    
    // Load content for each tab
    for (const tab of tabs) {
        try {
            const tabName = tab.replace(/^.*[\/]/, '');
            const tabContainer = document.getElementById(tabName);
            
            // Clear existing content
            tabContainer.innerHTML = '';
            
            // Fetch the list of files in the tab directory
            const dirResponse = await fetch(`tabs/${tabName}/`);
            if (!dirResponse.ok) {
                throw new Error(`Failed to fetch directory listing for ${tabName}`);
            }
            
            const dirText = await dirResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(dirText, 'text/html');
            
            // Extract JSON file names from the directory listing
            const jsonFiles = [];
            const links = doc.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.toLowerCase().endsWith('.json')) {
                    jsonFiles.push(href);
                }
            });
            
            // If no JSON files found, try to load the default items.json
            if (jsonFiles.length === 0) {
                jsonFiles.push('items.json');
            }
            
            // Load all JSON files for this tab
            for (const jsonFile of jsonFiles) {
                try {
                    // const response = await fetch(`tabs/${tabName}/${jsonFile}`);
                    const response = await fetch(`${jsonFile}`);
                    if (!response.ok) {
                        console.warn(`Failed to load ${jsonFile} for ${tabName}, skipping...`);
                        continue;
                    }
                    
                    const items = await response.json();
                    
                    // Handle both single object and array cases
                    const itemsArray = Array.isArray(items) ? items : [items];

                    // Add each project item
                    itemsArray.forEach(item => {
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

                        let titleStyle = '';
                        let startMark = '';
                        let endMark = '';

                        // Check if the project is disabled
                        if (item.status === "desativado"){
                            // titleStyle = 'style="text-decoration: line-through;"';
                            titleStyle = '';
                            startMark = '[OFF] ';
                            endMark = '';
                        }

                        // Check if the project is starred
                        if (item.status === "fav"){
                            titleStyle = '';
                            startMark = '⭐ ';
                            endMark = '';
                        }

                        projectItem.innerHTML = `
                            <h3 ${titleStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 16l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
                                </svg>
                                ${startMark}${item.title}${endMark}
                                ${externalLinkHtml}
                            </h3>
                            <p class="date">${item.date}</p>
                            <ul>
                                ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        `;
                        
                        tabContainer.appendChild(projectItem);
                    });
                } catch (jsonError) {
                    console.error(`Error loading ${jsonFile} for ${tabName}:`, jsonError);
                }
            }
        } catch (error) {
            console.error(`Error processing tab ${tab}:`, error);
        }
    }
}

// Load project items when the page loads
document.addEventListener('DOMContentLoaded', loadProjectItems);