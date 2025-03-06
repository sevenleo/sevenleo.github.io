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
            return ["bots", "ferramentas", "games", "tutoriais", "websites", "E1"];
        }
        return tabFolders;
    } catch (error) {
        console.error('Error creating dynamic tabs:', error);
        // Fallback to known tabs if there's an error
        // return ['E2','websites', 'bots', 'tutorials', 'games'];
        return ["bots", "ferramentas", "games", "tutoriais", "websites", "E2"];
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
    // Read items.txt to get the list of JSON files
    const response = await fetch('items.txt');
    if (!response.ok) {
        throw new Error('Failed to load items.txt');
    }
    
    const content = await response.text();
    const files = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && line.includes('tabs'))
        .map(line => {
            // Extract path after 'tabs' and normalize separators
            const path = line.substring(line.indexOf('tabs')).replace(/[\\\/]+/g, '/');
            return path;
        });

    // Get unique tab names from the file paths
    const tabs = [...new Set(files.map(file => {
        const parts = file.split('/');
        return parts[1]; // Get the folder name after 'tabs/'
    }))];

    // Create tab elements
    createTabElements(tabs);

    // Load content for each tab
    for (const tab of tabs) {
        try {
            const tabContainer = document.getElementById(tab);
            
            // Clear existing content
            tabContainer.innerHTML = '';
            
            // Get JSON files for this tab
            const tabFiles = files.filter(file => file.startsWith(`tabs/${tab}/`) && file.endsWith('.json'));
            
            // Load all JSON files for this tab
            for (const jsonFile of tabFiles) {
                try {
                    const response = await fetch(jsonFile);
                    if (!response.ok) {
                        console.warn(`Failed to load ${jsonFile} for ${tab}, skipping...`);
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

                        let itemIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 16l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
                                </svg>`;

                        if (item.icon != "" && item.icon != null && item.icon != undefined) {
                            itemIcon = item.icon;
                        }

                        // Check if the project is disabled
                        if (item.status === "desativado"){
                            titleStyle = '';
                            startMark = '[OFF] ';
                            endMark = '';
                        }

                        projectItem.innerHTML = `
                            <h3 ${titleStyle}>
                                ${itemIcon}
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
                    console.error(`Error loading ${jsonFile} for ${tab}:`, jsonError);
                }
            }
        } catch (error) {
            console.error(`Error processing tab ${tab}:`, error);
        }
    }
}

// Function to load skills from JSON file
async function loadSkills() {
    try {
        const response = await fetch('skills/skills.json');
        if (!response.ok) {
            throw new Error('Failed to load skills data');
        }
        
        const skillsData = await response.json();
        
        // Update primary skills
        const primarySkillsList = document.querySelector('.skills-list');
        if (primarySkillsList) {
            primarySkillsList.innerHTML = '';
            
            skillsData.primary_skills.forEach(skill => {
                const skillSpan = document.createElement('span');
                skillSpan.className = 'skill';
                skillSpan.textContent = skill;
                primarySkillsList.appendChild(skillSpan);
            });
        }
        
        // Update complementary skills
        const complementarySkillsList = document.querySelectorAll('.skills-list')[1];
        if (complementarySkillsList) {
            complementarySkillsList.innerHTML = '';
            
            skillsData.complementary_skills.forEach(skill => {
                const skillSpan = document.createElement('span');
                skillSpan.className = 'skill';
                skillSpan.textContent = skill;
                complementarySkillsList.appendChild(skillSpan);
            });
        }
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Function to load experience items from JSON files
async function loadExperienceItems() {
    try {
        // Get the list of JSON files from items.txt
        const response = await fetch('items.txt');
        if (!response.ok) {
            throw new Error('Failed to load items.txt');
        }
        
        const content = await response.text();

        const files = content.split('\n')
            .map(line => line.trim())
            .filter(line => line && line.includes('experiences'))
            .map(line => {
                // Extract path and normalize separators
                line = line.substring(line.indexOf('experiences')).replace(/[\\\/]+/g, '/');
                return line.replace(/\\/g, '/');
            });
            
        console.log("files: " + files);

        // Get the experience section
        const experienceSection = document.querySelector('.section:nth-of-type(2)');
        if (!experienceSection) {
            throw new Error('Experience section not found');
        }
        
        // Clear existing experience items except the heading
        const heading = experienceSection.querySelector('h2');
        experienceSection.innerHTML = '';
        experienceSection.appendChild(heading);
        
        // Load all experience JSON files       
        for (const jsonFile of files) {
            console.log("jsonFile: " + jsonFile);
            try {
                const response = await fetch(jsonFile);
                if (!response.ok) {
                    console.warn(`Failed to load ${jsonFile}, skipping...`);
                    continue;
                }
                
                const item = await response.json();
                
                // Create experience item
                const experienceItem = document.createElement('div');
                experienceItem.className = 'experience-item';
                
                experienceItem.innerHTML = `
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                d="M2 10l-2-2v8h20v-8l-2 2H2zm9-7h2v2H9V3zm-4 0h2v2H5V3zm8 0h2v2h-2V3zm4 0h2v2h-2V3zm-8 14h2v2H9v-2zm-4 0h2v2H5v-2zm8 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 9h2v2H7V9zm0-4h2v2H7V5zm0 8h2v2H7v-2zm4 4h2v2h-2v-2zm0-4h2v2H7v-2zm0-8h2v2H7V5zm0 4h2v2h-2V9zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-8h2v2H7V5zm0 4h2v2h-2V9zm4 4h2v2h-2v-2zm0-8h2v8h-2V9z" />
                        </svg>
                        ${item.company}
                        </h3>
                    <p class="date">${item.period}</p>
                    <p class="position">${item.position}</p>
                    <ul>
                        ${item.responsibilities}
                    </ul>
                `;
                
                experienceSection.appendChild(experienceItem);
            } catch (jsonError) {
                console.error(`Error loading experience file ${jsonFile}:`, jsonError);
            }
        }
    } catch (error) {
        console.error('Error loading experience items:', error);
    }
}

// Load all content when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    await loadProjectItems();
    await loadSkills();
    await loadExperienceItems();
});