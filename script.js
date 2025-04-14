// Clear scroll position on reload and prevent scroll position from being remembered
if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
}

// Scroll to top on page load
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Clear scroll position when navigating away
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Add shadow to header when scrolling
const header = document.querySelector('header');
window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Get viewport height
            const viewportHeight = window.innerHeight;
            
            // Get the element's position and dimensions
            const rect = target.getBoundingClientRect();
            const absoluteTop = window.pageYOffset + rect.top;
            
            // Calculate position to center element in viewport
            const targetPosition = absoluteTop - (viewportHeight - rect.height) / 2;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1500; // 1.5 seconds
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Smooth easing function
                const easeInOutCubic = t => t < 0.5 
                    ? 4 * t * t * t 
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Handle logo click to scroll to top
document.querySelector('.logo a').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll to top button functionality
const scrollToTopButton = document.getElementById('scrollToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

// Smooth scroll to top when button is clicked
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Publications Table Functionality
function filterPublications() {
    const input = document.getElementById('publicationSearch');
    const filter = input.value.toUpperCase();
    const table = document.querySelector('.publications-table');
    const tr = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
        // Check all cells (td) in the row
        let display = false;
        const td = tr[i].getElementsByTagName('td');
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    display = true;
                    break; // Found a match in this row, no need to check other cells
                }
            }
        }
        tr[i].style.display = display ? '' : 'none';
    }
}

let sortDirections = {}; // Store sort direction for each column index

function sortTable(columnIndex) {
    const table = document.querySelector('.publications-table');
    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = Array.from(tbody.getElementsByTagName('tr'));
    const header = table.getElementsByTagName('thead')[0].getElementsByTagName('th')[columnIndex];
    const headers = table.getElementsByTagName('thead')[0].getElementsByTagName('th');

    // Determine sort direction (initialize or toggle)
    const currentDirection = sortDirections[columnIndex] || 'asc'; // Default to ascending
    const direction = currentDirection === 'asc' ? 'desc' : 'asc';
    sortDirections = {}; // Reset other column directions
    sortDirections[columnIndex] = direction;

    // Remove active class and icons from all headers
    for (let i = 0; i < headers.length; i++) {
        headers[i].classList.remove('active', 'asc', 'desc');
        const icons = headers[i].querySelectorAll('.fas');
        icons.forEach(icon => {
            icon.classList.remove('fa-sort-up', 'fa-sort-down');
            if (icon.classList.contains('fa-sort')) {
                 icon.style.display = ''; // Show default sort icon
            } else {
                 icon.style.display = 'none'; // Hide specific sort icons
            }
        });
        // Ensure the default sort icon exists if needed
        if (!headers[i].querySelector('.fa-sort')) {
            const defaultIcon = document.createElement('i');
            defaultIcon.className = 'fas fa-sort';
            headers[i].appendChild(defaultIcon);
        }
         // Add back directional icons if they don't exist
        if (!headers[i].querySelector('.fa-sort-up')) {
            const upIcon = document.createElement('i');
            upIcon.className = 'fas fa-sort-up';
            upIcon.style.display = 'none'; // Hide initially
            headers[i].appendChild(upIcon);
        }
        if (!headers[i].querySelector('.fa-sort-down')) {
            const downIcon = document.createElement('i');
            downIcon.className = 'fas fa-sort-down';
            downIcon.style.display = 'none'; // Hide initially
            headers[i].appendChild(downIcon);
        }
    }

    // Add active class and correct icon to the clicked header
    header.classList.add('active', direction);
    const sortIcon = header.querySelector(direction === 'asc' ? '.fa-sort-up' : '.fa-sort-down');
    const defaultIcon = header.querySelector('.fa-sort');
     if (defaultIcon) defaultIcon.style.display = 'none'; // Hide default icon
     if (sortIcon) sortIcon.style.display = ''; // Show correct directional icon


    rows.sort((a, b) => {
        const cellA = a.getElementsByTagName('td')[columnIndex];
        const cellB = b.getElementsByTagName('td')[columnIndex];
        const valA = cellA ? cellA.textContent || cellA.innerText : '';
        const valB = cellB ? cellB.textContent || cellB.innerText : '';

        // Handle numeric sorting for the 'Year' column (index 0)
        if (columnIndex === 0) {
            return direction === 'asc' ? valA - valB : valB - valA;
        }

        // Handle string sorting for other columns
        const comparison = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
        return direction === 'asc' ? comparison : -comparison;
    });

    // Re-append sorted rows to the tbody
    rows.forEach(row => tbody.appendChild(row));
}

// Add initial sort icons to sortable headers on load
document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.publications-table');
    if (table) {
        const headers = table.querySelectorAll('th.sortable');
        headers.forEach(header => {
            if (!header.querySelector('.fa-sort')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-sort';
                header.appendChild(icon);
            }
             if (!header.querySelector('.fa-sort-up')) {
                const upIcon = document.createElement('i');
                upIcon.className = 'fas fa-sort-up';
                upIcon.style.display = 'none'; // Hide initially
                header.appendChild(upIcon);
            }
            if (!header.querySelector('.fa-sort-down')) {
                const downIcon = document.createElement('i');
                downIcon.className = 'fas fa-sort-down';
                downIcon.style.display = 'none'; // Hide initially
                header.appendChild(downIcon);
            }
        });
        // Optional: Default sort by year descending on load
        // sortTable(0); // Sort by Year initially
        // sortTable(0); // Call again to make it descending
    }
});
