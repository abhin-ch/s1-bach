document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const closeMenuButton = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.getElementById('navbar');
    
    // Initialize mobile menu
    if (mobileMenuButton && closeMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
        
        closeMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
        
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // Make navbar always visible instead of scroll-dependent
    navbar.classList.add('visible');
    
    // Smooth Scrolling with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animations on Scroll
    function checkVisible(elm) {
        var rect = elm.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }
    
    function handleScrollAnimation() {
        const fadeElements = document.querySelectorAll('.banner-content, .section-title');
        const slideElements = document.querySelectorAll('.day, .accommodation');
        
        fadeElements.forEach(element => {
            if (checkVisible(element)) {
                element.classList.add('fade-in');
            }
        });
        
        slideElements.forEach(element => {
            if (checkVisible(element)) {
                element.classList.add('slide-up');
            }
        });
    }
    
    // Initial check on load
    handleScrollAnimation();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Countdown Timer
    const countdownDate = new Date("April 18, 2025 16:00:00").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("days").innerText = "0";
            document.getElementById("hours").innerText = "0";
            document.getElementById("minutes").innerText = "0";
            document.getElementById("seconds").innerText = "0";
        }
    }
    
    // Initialize countdown
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Preload banner image for smoother experience
    const preloadBanner = new Image();
    preloadBanner.src = 'img/img1.jpg';
    
    // Add dynamic flair to the footer logo
    const footerLogo = document.querySelector('footer .logo');
    if (footerLogo) {
        footerLogo.addEventListener('mouseover', () => {
            footerLogo.style.transform = 'scale(1.05)';
            footerLogo.style.transition = 'transform 0.3s ease';
        });
        
        footerLogo.addEventListener('mouseout', () => {
            footerLogo.style.transform = 'scale(1)';
        });
    }
    
    // Make the cost table sortable
    const costTables = document.querySelectorAll('.cost-table');
    costTables.forEach(costTable => {
        const costTableHeaders = costTable.querySelectorAll('th');
        
        costTableHeaders.forEach((header, index) => {
            header.addEventListener('click', () => {
                const tableBody = costTable.querySelector('tbody');
                const rows = Array.from(tableBody.querySelectorAll('tr'));
                
                // Sort rows based on the content of cells in the clicked column
                rows.sort((rowA, rowB) => {
                    const cellA = rowA.querySelectorAll('td')[index].textContent;
                    const cellB = rowB.querySelectorAll('td')[index].textContent;
                    
                    // Handle numeric sorting (remove $ and convert to number)
                    if (cellA.includes('$') && cellB.includes('$')) {
                        return parseFloat(cellA.replace('$', '')) - parseFloat(cellB.replace('$', ''));
                    }
                    
                    // Regular string comparison
                    return cellA.localeCompare(cellB);
                });
                
                // Remove existing rows
                rows.forEach(row => tableBody.removeChild(row));
                
                // Add sorted rows
                rows.forEach(row => tableBody.appendChild(row));
            });
            
            // Add cursor pointer to indicate sortable
            header.style.cursor = 'pointer';
        });
    });
    
    // Expense Calculator Logic
    const calculatorForm = document.getElementById('expense-calculator-form');
    const numPeopleSlider = document.getElementById('num-people');
    const numPeopleValue = document.getElementById('num-people-value');
    const totalPerPersonEl = document.getElementById('total-per-person');
    const expenseBreakdownEl = document.getElementById('expense-breakdown');
    
    // Initialize values
    if (numPeopleSlider && numPeopleValue) {
        // Set initial value display
        numPeopleValue.textContent = numPeopleSlider.value;
        
        // Update displayed value when slider changes
        numPeopleSlider.addEventListener('input', function() {
            numPeopleValue.textContent = this.value;
            calculateTotal();
        });
    }
    
    // Calculate total expenses
    function calculateTotal() {
        if (!calculatorForm) return;
        
        const formData = new FormData(calculatorForm);
        const numPeople = parseInt(formData.get('num-people'));
        const accommodationCost = parseFloat(formData.get('accommodation-cost') || 844.22); // Default to AirBnB cost
        const foodCost = parseFloat(formData.get('food-cost') || 0);
        const spaCost = parseFloat(formData.get('spa-cost') || 0);
        const axeCost = parseFloat(formData.get('axe-cost') || 0);
        const alcoholCost = parseFloat(formData.get('alcohol-cost') || 0);
        const gasCost = parseFloat(formData.get('gas-cost') || 0);
        const djNightCost = parseFloat(formData.get('dj-night-cost') || 0);
        const otherCost = parseFloat(formData.get('other-cost') || 0);
        
        // Calculate per person costs
        const accommodationPerPerson = accommodationCost / numPeople;
        const gasPerPerson = gasCost / numPeople;
        
        // Fixed costs per person
        const spaPerPerson = spaCost;
        const axePerPerson = axeCost;
        const alcoholPerPerson = alcoholCost;
        const foodPerPerson = foodCost;
        const djNightPerPerson = djNightCost;
        const otherPerPerson = otherCost;
        
        // Calculate total per person
        const totalPerPerson = accommodationPerPerson + 
                              gasPerPerson + 
                              spaPerPerson + 
                              axePerPerson + 
                              alcoholPerPerson + 
                              foodPerPerson + 
                              djNightPerPerson + 
                              otherPerPerson;
        
        // Update UI
        if (totalPerPersonEl) {
            totalPerPersonEl.textContent = `$${totalPerPerson.toFixed(2)}`;
        }
        
        // Update expense breakdown
        if (expenseBreakdownEl) {
            expenseBreakdownEl.innerHTML = `
                <tr>
                    <td>Accommodation</td>
                    <td>$${accommodationPerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Gas</td>
                    <td>$${gasPerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Spa</td>
                    <td>$${spaPerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Axe Throwing</td>
                    <td>$${axePerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Alcohol</td>
                    <td>$${alcoholPerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Food</td>
                    <td>$${foodPerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>DJ Night</td>
                    <td>$${djNightPerPerson.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Other Expenses</td>
                    <td>$${otherPerPerson.toFixed(2)}</td>
                </tr>
            `;
        }
    }
    
    // Event listeners for calculator inputs
    if (calculatorForm) {
        calculatorForm.addEventListener('input', calculateTotal);
        
        // Initial calculation
        calculateTotal();
    }
});