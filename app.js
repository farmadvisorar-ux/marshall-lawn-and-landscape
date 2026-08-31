/**
 * Marshall Lawn and Landscape - Interactive Application & SEO Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initQuoteCalculator();
  initBeforeAfterSlider();
  initMaterialVisualizer();
  initGallery();
  initVideoReels();
  initZipChecker();
  initFaqAccordion();
  initModalsAndForms();
  initMobileMenu();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('mll_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mll_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' 
    ? `<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>`
    : `<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>`;
}

/* ==========================================================================
   2. Live Instant Lawn Quote Estimator Engine
   ========================================================================== */
function initQuoteCalculator() {
  const yardSlider = document.getElementById('yardSizeSlider');
  const yardDisplay = document.getElementById('yardSizeDisplay');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const freqPills = document.querySelectorAll('.freq-pill');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-cb');
  const breakdownList = document.getElementById('calcBreakdownList');
  const bookWithQuoteBtn = document.getElementById('bookWithQuoteBtn');

  if (!yardSlider || !priceDisplay) return;

  let currentFrequency = 'weekly';

  function calculateQuote() {
    const sqFt = parseInt(yardSlider.value, 10);
    yardDisplay.textContent = sqFt >= 43560 
      ? `${(sqFt / 43560).toFixed(1)} Acres (${sqFt.toLocaleString()} sq ft)`
      : `${sqFt.toLocaleString()} sq ft`;

    // Base mowing & maintenance rate calculation
    let baseMowing = 45;
    if (sqFt > 5000) {
      baseMowing += Math.round((sqFt - 5000) * 0.0045);
    }
    if (sqFt > 20000) {
      baseMowing = Math.round(110 + (sqFt - 20000) * 0.003);
    }

    let addOnsTotal = 0;
    let activeAddOns = [];

    serviceCheckboxes.forEach(cb => {
      const card = cb.closest('.service-checkbox-card');
      if (cb.checked) {
        card.classList.add('selected');
        const price = parseInt(cb.dataset.price, 10) || 0;
        addOnsTotal += price;
        activeAddOns.push({ name: cb.dataset.name, price: price });
      } else {
        card.classList.remove('selected');
      }
    });

    // Frequency multiplier
    let freqMultiplier = 1.0;
    let freqLabel = 'Weekly (15% Preferred Rate)';
    if (currentFrequency === 'weekly') {
      freqMultiplier = 0.85; // 15% discount for weekly regular
    } else if (currentFrequency === 'biweekly') {
      freqMultiplier = 1.0;
      freqLabel = 'Bi-Weekly Maintenance';
    } else if (currentFrequency === 'onetime') {
      freqMultiplier = 1.25; // Setup surcharge for one-off
      freqLabel = 'One-Time Service';
    }

    const calculatedPerVisit = Math.round((baseMowing * freqMultiplier) + addOnsTotal);
    priceDisplay.textContent = `$${calculatedPerVisit}`;

    // Render itemized breakdown
    if (breakdownList) {
      let html = `
        <div class="calc-breakdown-row">
          <span>Lawn Mowing & Edging (${yardDisplay.textContent})</span>
          <strong>$${Math.round(baseMowing * freqMultiplier)}</strong>
        </div>
        <div class="calc-breakdown-row" style="color: var(--primary-400)">
          <span>Plan Schedule</span>
          <span>${freqLabel}</span>
        </div>
      `;
      activeAddOns.forEach(item => {
        html += `
          <div class="calc-breakdown-row">
            <span>+ ${item.name}</span>
            <strong>+$${item.price}</strong>
          </div>
        `;
      });
      breakdownList.innerHTML = html;
    }

    // Store estimate in state for booking form
    window.currentCalculatedQuote = {
      sqFt: sqFt,
      frequency: currentFrequency,
      total: calculatedPerVisit,
      addOns: activeAddOns.map(a => a.name)
    };
  }

  yardSlider.addEventListener('input', calculateQuote);

  freqPills.forEach(pill => {
    pill.addEventListener('click', () => {
      freqPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFrequency = pill.dataset.freq;
      calculateQuote();
    });
  });

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateQuote);
  });

  if (bookWithQuoteBtn) {
    bookWithQuoteBtn.addEventListener('click', () => {
      openBookingModalWithQuote();
    });
  }

  // Initial calculation
  calculateQuote();
}

function openBookingModalWithQuote() {
  const modal = document.getElementById('bookingModal');
  const detailsField = document.getElementById('modalServiceNotes');
  if (modal && window.currentCalculatedQuote) {
    if (detailsField) {
      detailsField.value = `Instant Online Estimate: $${window.currentCalculatedQuote.total}/visit\n` +
        `Yard Size: ${window.currentCalculatedQuote.sqFt} sq ft\n` +
        `Schedule: ${window.currentCalculatedQuote.frequency}\n` +
        `Selected Add-ons: ${window.currentCalculatedQuote.addOns.join(', ') || 'None'}`;
    }
    modal.classList.add('active');
  }
}

/* ==========================================================================
   3. Interactive Draggable Before / After Transformation Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  const afterLayer = document.getElementById('baAfterLayer');
  const handle = document.getElementById('baHandle');
  const presetBtns = document.querySelectorAll('.ba-preset-btn');
  const beforeImg = document.getElementById('baBeforeImg');
  const afterImg = document.getElementById('baAfterImg');

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  const presets = {
    restoration: {
      before: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      after: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      title: 'Overgrown Turf to Striped Precision Lawn'
    },
    hardscape: {
      before: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      after: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      title: 'Dirt Slope to Custom Flagstone Patio & Fire Pit'
    },
    flowerbed: {
      before: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      after: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      title: 'Weed-Infested Beds to Premium Mulch & Perennial Garden'
    },
    sod: {
      before: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      after: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr8Au0wMUbP3IJky3UvjJVsECEFU-D5P4ecoh3ln4HSR8lmgdwY1rIVlWuBsMajULR_0OirxkEP4Vg30kemOayLlHWkd2eP27u-XrvMRhpsHUf_VDdEQE5GFIOEJJbrMCmlitZ=w1200-h800-k-no',
      title: 'Patchy Bare Dirt to Instant Lush Zoysia Sod'
    }
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      presetBtns.forEach(b => b.classList.add('btn-outline'));
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline');

      const key = btn.dataset.preset;
      if (presets[key]) {
        beforeImg.src = presets[key].before;
        afterImg.src = presets[key].after;
      }
    });
  });

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    if (pos < 0.05) pos = 0.05;
    if (pos > 0.95) pos = 0.95;

    const percentage = pos * 100;
    afterLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Events (Mobile)
  handle.addEventListener('touchstart', () => isDragging = true, { passive: true });
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Click anywhere on container to move
  container.addEventListener('click', (e) => {
    setSliderPosition(e.clientX);
  });
}

/* ==========================================================================
   4. Material & Texture Visualizer
   ========================================================================== */
function initMaterialVisualizer() {
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const vizBox = document.getElementById('vizPreviewBox');
  const vizTitle = document.getElementById('vizTitle');
  const vizDesc = document.getElementById('vizDesc');

  if (!swatchBtns.length || !vizBox) return;

  const materials = {
    'dark-hardwood': {
      title: 'Premium Double-Shredded Dark Hardwood Mulch',
      desc: 'All-natural shredded hardwood that breaks down slowly to nourish East Texas soil, lock in moisture, regulate root temperature, and prevent stubborn weed germination.',
      bg: 'linear-gradient(135deg, #3b281c, #1f140e)',
      icon: '🍂'
    },
    'midnight-black': {
      title: 'Ultra-Rich Midnight Black Dyed Mulch',
      desc: 'Eco-safe dyed black mulch providing maximum color contrast against bright green shrubs and stone borders. Color retains deep hue for up to 12 months in direct Texas sunlight.',
      bg: 'linear-gradient(135deg, #18181b, #09090b)',
      icon: '🖤'
    },
    'cedar-red': {
      title: 'Aromatic Red Cedar Mulch',
      desc: 'Natural insect-repelling red cedar mulch with a warm rustic hue. Ideal for perimeter beds around outdoor living areas and flower gardens.',
      bg: 'linear-gradient(135deg, #7f1d1d, #450a0a)',
      icon: '🍁'
    },
    'pine-straw': {
      title: 'Longleaf Clean Pine Straw',
      desc: 'Lightweight, acid-loving organic ground cover perfect for azaleas, hydrangeas, pine tree beds, and large estate landscape slopes.',
      bg: 'linear-gradient(135deg, #b45309, #78350f)',
      icon: '🌲'
    },
    'bermuda-sod': {
      title: 'Tifway 419 Certified Bermuda Sod',
      desc: 'The gold standard for Texas heat and drought tolerance. Dense carpet-like texture, rapid self-repair, and golf-course striping capability in full sun.',
      bg: 'linear-gradient(135deg, #16a34a, #14532d)',
      icon: '🌱'
    },
    'zoysia-sod': {
      title: 'Emerald / Zeon Luxury Zoysia Sod',
      desc: 'Velvet-soft, barefoot-friendly premium turf with exceptional shade tolerance, minimal mowing requirements, and a deep emerald color.',
      bg: 'linear-gradient(135deg, #15803d, #052e16)',
      icon: '🌿'
    }
  };

  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const matKey = btn.dataset.material;
      if (materials[matKey]) {
        vizTitle.textContent = materials[matKey].title;
        vizDesc.textContent = materials[matKey].desc;
        vizBox.style.background = materials[matKey].bg;
        vizBox.innerHTML = `<div style="font-size: 3.5rem;">${materials[matKey].icon}</div>`;
      }
    });
  });
}
  });
}

/* ==========================================================================
   5. Service Area & ZIP Code Route Checker
   ========================================================================== */
function initZipChecker() {
  const form = document.getElementById('zipSearchForm');
  const input = document.getElementById('zipInput');
  const resultBox = document.getElementById('zipResult');

  if (!form || !input || !resultBox) return;

  const validZipMap = {
    '75670': { city: 'Marshall, TX', schedule: 'Monday & Thursday Service Routes' },
    '75671': { city: 'Marshall, TX', schedule: 'Monday & Thursday Service Routes' },
    '75672': { city: 'Marshall, TX', schedule: 'Monday & Thursday Service Routes' },
    '75650': { city: 'Hallsville, TX', schedule: 'Tuesday & Friday Service Routes' },
    '75601': { city: 'Longview, TX', schedule: 'Wednesday & Friday Service Routes' },
    '75602': { city: 'Longview, TX', schedule: 'Wednesday & Friday Service Routes' },
    '75603': { city: 'Longview, TX', schedule: 'Wednesday & Friday Service Routes' },
    '75604': { city: 'Longview, TX', schedule: 'Wednesday & Friday Service Routes' },
    '75605': { city: 'Longview, TX', schedule: 'Wednesday & Friday Service Routes' },
    '75657': { city: 'Jefferson, TX', schedule: 'Tuesday Service Routes' },
    '75692': { city: 'Waskom, TX', schedule: 'Thursday Service Routes' },
    '75633': { city: 'Carthage, TX', schedule: 'Friday Service Routes' },
    '75642': { city: 'Elysian Fields, TX', schedule: 'Thursday Service Routes' },
    '75688': { city: 'Scottsville, TX', schedule: 'Monday Service Routes' },
    '75651': { city: 'Harleton, TX', schedule: 'Tuesday Service Routes' }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();

    if (validZipMap[query]) {
      const match = validZipMap[query];
      resultBox.className = 'zip-result-display success';
      resultBox.innerHTML = `
        <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 0.25rem;">
          ✅ Direct Service Route Confirmed for ${match.city} (${query})!
        </div>
        <p style="font-size: 0.9rem; margin-bottom: 0.75rem;">
          Our crews operate active weekly routes in your neighborhood: <strong>${match.schedule}</strong>.
        </p>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('bookingSection').scrollIntoView({behavior:'smooth'})">
          Claim Next Available Service Slot
        </button>
      `;
    } else if (query.length === 5) {
      resultBox.className = 'zip-result-display success';
      resultBox.innerHTML = `
        <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 0.25rem;">
          📍 Service Available by Appointment in ${query}!
        </div>
        <p style="font-size: 0.9rem; margin-bottom: 0.75rem;">
          We service this area for full landscape installations, sod laying, and regular route expansion. Call or request a fast quote below.
        </p>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('bookingSection').scrollIntoView({behavior:'smooth'})">
          Request Fast Free Estimate
        </button>
      `;
    } else {
      resultBox.className = 'zip-result-display fail';
      resultBox.innerHTML = `
        <div style="font-weight: 800; font-size: 1rem;">
          Please enter a valid 5-digit Texas ZIP code (e.g. 75670, 75650, 75601).
        </div>
      `;
    }
  });
}

/* ==========================================================================
   6. FAQ Accordion & Live Keyword Filter
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   7. Modals, Toast Notifications & Form Submissions
   ========================================================================== */
function initModalsAndForms() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const quickForm = document.getElementById('heroQuickForm');
  const bookingForm = document.getElementById('mainBookingForm');
  const modalForm = document.getElementById('modalBookingForm');

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.classList.remove('active');
    });
  }

  function handleFormSubmit(form, formName) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const dataObj = Object.fromEntries(formData.entries());

      // Save locally
      const storedLeads = JSON.parse(localStorage.getItem('mll_leads') || '[]');
      storedLeads.push({
        ...dataObj,
        timestamp: new Date().toISOString(),
        formSource: formName
      });
      localStorage.setItem('mll_leads', JSON.stringify(storedLeads));

      // Close modal if open
      if (modal) modal.classList.remove('active');

      // Show toast
      showToast(`Thank you, ${dataObj.name || 'Friend'}! Your quote request has been sent. We'll text/call you within 15 minutes.`);
      form.reset();
    });
  }

  handleFormSubmit(quickForm, 'Hero Quick Quote');
  handleFormSubmit(bookingForm, 'Main Booking Form');
  handleFormSubmit(modalForm, 'Modal Booking Form');
}

function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="24" height="24" fill="var(--primary-400)" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

/* ==========================================================================
   8. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      if (isVisible) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--bg-surface)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        navLinks.style.boxShadow = 'var(--card-shadow)';
      }
    });

    // Close on click of link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   9. Photo Gallery Filter & Lightbox Viewer
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxCloseBtn');

  if (!items.length) return;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  if (lightbox && lightboxImg && lightboxCaption) {
    items.forEach(item => {
      if (item.tagName.toLowerCase() === 'div' && item.dataset.img) {
        item.addEventListener('click', () => {
          const fullImg = item.dataset.img;
          const title = item.dataset.title || 'Marshall Lawn and Landscape Official Work';
          lightboxImg.src = fullImg;
          lightboxCaption.textContent = title;
          lightbox.classList.add('active');
        });
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('active');
    });
  }
}

/* ==========================================================================
   10. Video Reel Modal Player
   ========================================================================== */
function initVideoReels() {
  const videoCards = document.querySelectorAll('.video-card');
  const videoModal = document.getElementById('videoPlayModal');
  const videoIframe = document.getElementById('videoPlayerIframe');
  const videoTitle = document.getElementById('videoModalTitle');
  const closeBtn = document.getElementById('videoModalCloseBtn');

  if (!videoCards.length || !videoModal || !videoIframe) return;

  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.videoSrc;
      const title = card.dataset.videoTitle || 'Marshall Lawn and Landscape Project Reel';
      videoIframe.src = src;
      if (videoTitle) videoTitle.textContent = title;
      videoModal.classList.add('active');
    });
  });

  function closeVideo() {
    videoModal.classList.remove('active');
    videoIframe.src = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideo);
  }

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideo();
    }
  });
}


