/* 
   Smart Fertilizer Prediction System - Main JavaScript File
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Preloader Fade Out
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
        // Safety timeout in case load event already fired
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    // 2. Navbar Scrolled Class
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        const checkScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Check on init
    }

    // 3. Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Live Update Range Sliders Value Badges
    const sliders = document.querySelectorAll('.range-slider-custom');
    sliders.forEach(slider => {
        const valBadge = document.getElementById(`${slider.id}-val`);
        if (valBadge) {
            valBadge.textContent = slider.value;
            slider.addEventListener('input', () => {
                valBadge.textContent = slider.value;
            });
        }
    });

    // Helper: Get CSRF Token from Cookie
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    // 5. Predict Form AJAX Submission
    const predictForm = document.getElementById('predictForm');
    const loadingOverlay = document.getElementById('predictLoadingOverlay');
    const resultSection = document.getElementById('predictionResult');

    if (predictForm) {
        predictForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate mandatory fields: Soil Type and Crop Type
            const soilType = document.getElementById('soil_type').value;
            const cropType = document.getElementById('crop_type').value;

            if (!soilType || soilType === "") {
                alert("Please select a Soil Type before running the prediction.");
                return;
            }
            if (!cropType || cropType === "") {
                alert("Please select a Crop Type before running the prediction.");
                return;
            }

            // Show loader overlay
            loadingOverlay.style.display = 'flex';
            resultSection.style.display = 'none';

            // Extract form data
            const formData = new FormData(predictForm);

            // Fetch request (Simulate 1.2s delay for satisfying spinner UI interaction)
            setTimeout(() => {
                fetch(predictForm.action, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    loadingOverlay.style.display = 'none';

                    if (data.success) {
                        // Populate results
                        document.getElementById('resFertilizerName').textContent = data.name;
                        document.getElementById('resConfidence').textContent = data.confidence;
                        document.getElementById('resDescription').textContent = data.description;
                        
                        // Dynamically update fertilizer image
                        const nameLower = data.name.toLowerCase();
                        let imgFile = 'npk.png';
                        if (nameLower.includes('urea')) {
                            imgFile = 'urea.png';
                        } else if (nameLower.includes('dap') || nameLower.includes('tsp') || nameLower.includes('superphosphate')) {
                            imgFile = 'dap.png';
                        } else if (nameLower.includes('mop') || nameLower.includes('potash') || nameLower.includes('potassium chloride') || nameLower.includes('potassium sulfate')) {
                            imgFile = 'mop.png';
                        }
                        const fertilizerImg = document.getElementById('resFertilizerImg');
                        if (fertilizerImg) {
                            fertilizerImg.src = `/static/core/images/${imgFile}`;
                            fertilizerImg.alt = data.name;
                        }

                        // Populate precautions
                        const precautionsList = document.getElementById('resPrecautions');
                        precautionsList.innerHTML = '';
                        data.precautions.forEach(prec => {
                            const li = document.createElement('li');
                            li.textContent = prec;
                            precautionsList.appendChild(li);
                        });

                        // Populate suitable crops
                        const cropsContainer = document.getElementById('resSuitableCrops');
                        cropsContainer.innerHTML = '';
                        data.suitable_crops.forEach(crop => {
                            const badge = document.createElement('span');
                            badge.textContent = crop;
                            cropsContainer.appendChild(badge);
                        });

                        // Show result card
                        resultSection.style.display = 'block';

                        // Scroll smoothly to results with sticky navbar offset
                        setTimeout(() => {
                            const navbar = document.querySelector('.navbar-custom');
                            const navbarHeight = navbar ? navbar.offsetHeight : 80;
                            const elementTop = resultSection.getBoundingClientRect().top + window.scrollY;
                            
                            window.scrollTo({
                                top: elementTop - navbarHeight - 20,
                                behavior: 'smooth'
                            });
                        }, 100);
                    } else {
                        alert(`Prediction error: ${data.error || 'Unknown error occurred.'}`);
                    }
                })
                .catch(err => {
                    loadingOverlay.style.display = 'none';
                    alert(`Network error: ${err.message}`);
                });
            }, 1200);
        });

        // Reset Button handling
        predictForm.addEventListener('reset', () => {
            resultSection.style.display = 'none';
            // Wait for call stack to clear before resetting sliders text
            setTimeout(() => {
                sliders.forEach(slider => {
                    const valBadge = document.getElementById(`${slider.id}-val`);
                    if (valBadge) valBadge.textContent = slider.value;
                });
            }, 50);
        });
    }

    // 6. Contact Form AJAX Submission
    const contactForm = document.getElementById('contactForm');
    const contactAlertContainer = document.getElementById('contactAlertContainer');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous alerts
            contactAlertContainer.innerHTML = '';

            const formData = new FormData(contactForm);

            // Send POST request
            fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    contactAlertContainer.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm" role="alert">
                            <i class="bi bi-check-circle-fill me-2"></i> ${data.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    contactForm.reset();
                } else {
                    contactAlertContainer.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm" role="alert">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${data.error}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                }
            })
            .catch(err => {
                contactAlertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm" role="alert">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i> Network error: ${err.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
            });
        });
    }
});
