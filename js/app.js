/**
 * Wedding Invitation Core Application Logic
 * Ilham & Risa - 16 Oktober 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  initGuestPersonalization();
  initCoverAndAudio();
  initCountdownTimer();
  initLightbox();
  initCopyButtons();
  initRSVPAndGuestbook();
  initScrollSpyAndAnimations();
});

/* ==========================================================================
   1. GUEST PERSONALIZATION VIA URL QUERY PARAM
   ========================================================================== */
function initGuestPersonalization() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = urlParams.get('to') || urlParams.get('nama') || urlParams.get('guest');
  const guestNameElement = document.getElementById('guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');

  if (guestNameParam) {
    const formattedName = decodeURIComponent(guestNameParam.replace(/\+/g, ' '));
    if (guestNameElement) {
      guestNameElement.textContent = formattedName;
    }
    if (rsvpNameInput && !rsvpNameInput.value) {
      rsvpNameInput.value = formattedName;
    }
  } else {
    if (guestNameElement) {
      guestNameElement.textContent = 'Tamu Undangan';
    }
  }
}

/* ==========================================================================
   2. COVER GATE & AUDIO CONTROLLER
   ========================================================================== */
let isMusicPlaying = false;
let audioPlayer = null;
let audioContext = null;
let synthInterval = null;

function initCoverAndAudio() {
  const coverScreen = document.getElementById('cover-screen');
  const btnOpen = document.getElementById('btn-open-invitation');
  const floatingAudioBtn = document.getElementById('floating-audio-btn');
  audioPlayer = document.getElementById('bg-music');

  // Lock body scroll initially
  document.body.classList.add('locked');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Unlock body scroll & hide cover screen
      document.body.classList.remove('locked');
      if (coverScreen) {
        coverScreen.classList.add('opened');
      }

      // Start music playback
      playAudio();

      // Smooth scroll to top of hero
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (floatingAudioBtn) {
    floatingAudioBtn.addEventListener('click', () => {
      toggleAudio();
    });
  }
}

function playAudio() {
  const floatingAudioBtn = document.getElementById('floating-audio-btn');
  if (!audioPlayer) return;

  // Try standard audio element first
  audioPlayer.play().then(() => {
    isMusicPlaying = true;
    if (floatingAudioBtn) floatingAudioBtn.classList.add('playing');
  }).catch((err) => {
    console.warn('HTML5 Audio playback prevented or file unreachable, enabling ambient Web Audio melody fallback:', err);
    startSyntheticWeddingMelody();
    isMusicPlaying = true;
    if (floatingAudioBtn) floatingAudioBtn.classList.add('playing');
  });
}

function pauseAudio() {
  const floatingAudioBtn = document.getElementById('floating-audio-btn');
  if (audioPlayer) {
    audioPlayer.pause();
  }
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
  isMusicPlaying = false;
  if (floatingAudioBtn) floatingAudioBtn.classList.remove('playing');
}

function toggleAudio() {
  if (isMusicPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

/**
 * Romantic ambient harp/celesta melody generator using Web Audio API
 * Guarantees romantic background music plays even offline or without external MP3
 */
function startSyntheticWeddingMelody() {
  if (synthInterval) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Canon in D / Romantic Arpeggio notes (frequencies in Hz)
    const notes = [
      293.66, 369.99, 440.00, 587.33, // D major
      220.00, 277.18, 329.63, 440.00, // A major
      246.94, 293.66, 369.99, 493.88, // B minor
      185.00, 220.00, 277.18, 369.99, // F# minor
      196.00, 246.94, 293.66, 392.00, // G major
      146.83, 185.00, 220.00, 293.66  // D major bass
    ];

    let noteIdx = 0;
    const playNote = () => {
      if (!isMusicPlaying) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioContext.currentTime);

      gain.gain.setValueAtTime(0.001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.6);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 1.8);
      noteIdx++;
    };

    playNote();
    synthInterval = setInterval(playNote, 420);
  } catch (e) {
    console.error('Web Audio API not supported', e);
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER (16 OKTOBER 2026 13:00 WIB - AKAD NIKAH)
   ========================================================================== */
function initCountdownTimer() {
  // Target: 16 October 2026 at 13:00:00 Western Indonesia Time (UTC+7) - Akad Nikah
  const targetDate = new Date('2026-10-16T13:00:00+07:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const timerContainer = document.getElementById('countdown-timer');

  function updateTimer() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (timerContainer) {
        timerContainer.innerHTML = '<div style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--primary-gold-light); font-weight: 600; padding: 1rem;">Hari Bahagia Telah Tiba!</div>';
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. LIGHTBOX IMAGE PREVIEW
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   5. 1-CLICK COPY CLIPBOARD & TOAST
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast-notification');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('✓ Berhasil disalin ke clipboard!');
        }).catch(() => {
          fallbackCopyText(textToCopy, showToast);
        });
      } else {
        fallbackCopyText(textToCopy, showToast);
      }
    });
  });
}

function fallbackCopyText(text, callback) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    callback('✓ Berhasil disalin ke clipboard!');
  } catch (err) {
    callback('Gagal menyalin text');
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   6. RSVP & GUESTBOOK (UCAPAN & DOA)
   ========================================================================== */
const DEFAULT_WISHES = [
  {
    name: 'Bpk. Bambang Sutrisno & Keluarga',
    attendance: 'hadir',
    message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khoir. Selamat menempuh hidup baru untuk Ilham dan Risa, semoga menjadi keluarga sakinah mawaddah warahmah.',
    time: '2 jam yang lalu'
  },
  {
    name: 'Sarah Dianita, S.Ked',
    attendance: 'hadir',
    message: 'Selamat Risa sayang & Ilham! MasyaAllah tabarakallah lancar sampai hari H yaa. See you on the big day!',
    time: '5 jam yang lalu'
  },
  {
    name: 'Dimas Kurniawan & Istri',
    attendance: 'hadir',
    message: 'Happy wedding bro Ilham & Risa! Semoga selalu dipenuhi kebahagiaan dan berkah melimpah seumur hidup. Aamiin.',
    time: '1 hari yang lalu'
  },
  {
    name: 'Anisa Rahmawati',
    attendance: 'ragu',
    message: 'Selamat untuk kedua mempelai! Mohon maaf kemungkinan agak telat karena ada dinas, tapi diusahakan hadir. Selamat yaa!',
    time: '1 hari yang lalu'
  }
];

// GANTI DENGAN URL DAN ANON KEY SUPABASE ANDA
const SUPABASE_URL = 'https://afdupjxkrwomvykempwo.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_3wLqM21wR3TYSSAZswZNug_8qNJFUAT'; 
const TABLE_NAME = 'wishes';

async function fetchWishesFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error("Gagal mengambil data dari Supabase:", e);
  }
  return null;
}

async function saveWishToSupabase(wish) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(wish)
    });
    return response.ok;
  } catch (e) {
    console.error("Gagal menyimpan data ke Supabase:", e);
    return false;
  }
}

async function initRSVPAndGuestbook() {
  const form = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const counterEl = document.getElementById('wishes-counter');

  let wishes = [...DEFAULT_WISHES];

  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';
    if (counterEl) counterEl.textContent = `${wishes.length} Ucapan`;

    wishes.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'wish-card';

      let badgeClass = 'hadir';
      let badgeLabel = 'Hadir';
      if (item.attendance === 'tidak-hadir') {
        badgeClass = 'tidak-hadir';
        badgeLabel = 'Tidak Hadir';
      } else if (item.attendance === 'ragu') {
        badgeClass = 'ragu';
        badgeLabel = 'Masih Ragu';
      }

      const name = item.name || 'Tamu';
      const message = item.message || '';
      // Parse dates from DB or use local time
      let timeStr = item.time || 'Baru saja';
      if (item.created_at) {
        const dateObj = new Date(item.created_at);
        timeStr = dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-name">${escapeHtml(name)}</span>
          <span class="wish-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <p class="wish-message">${escapeHtml(message)}</p>
        <span class="wish-time">${escapeHtml(timeStr)}</span>
      `;
      wishesList.appendChild(card);
    });
  }

  // Initial render (shows dummy data if Supabase is not configured)
  renderWishes();

  // Try fetching actual data from Supabase
  const dbWishes = await fetchWishesFromSupabase();
  if (dbWishes && dbWishes.length > 0) {
    wishes = dbWishes;
    renderWishes();
  } else if (dbWishes) {
    wishes = []; // if DB is connected but empty
    renderWishes();
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = form.querySelector('button[type="submit"]');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Mengirim...';
      }

      const nameInput = document.getElementById('rsvp-name');
      const attendanceInput = document.getElementById('rsvp-attendance');
      const messageInput = document.getElementById('rsvp-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const attendance = attendanceInput ? attendanceInput.value : 'hadir';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !message) {
        alert('Mohon lengkapi Nama dan Doa / Ucapan Anda.');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Kirim Konfirmasi & Ucapan';
        }
        return;
      }

      const newWish = {
        name: name,
        attendance: attendance,
        message: message,
        time: 'Baru saja'
      };

      // Instantly update UI for the user
      wishes.unshift(newWish);
      renderWishes();

      // Save to Supabase in the background
      await saveWishToSupabase({ name, attendance, message });

      // Reset form
      if (messageInput) messageInput.value = '';
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Kirim Konfirmasi & Ucapan';
      }

      const toast = document.getElementById('toast-notification');
      if (toast) {
        toast.textContent = '✓ Terima kasih atas konfirmasi & doa restu Anda!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }
    });
  }
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}

/* ==========================================================================
   7. SCROLL SPY NAVIGATION & ANIMATIONS
   ========================================================================== */
function initScrollSpyAndAnimations() {
  // IntersectionObserver for reveal animation
  const revealElements = document.querySelectorAll('.fade-in-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // ScrollSpy for Bottom Navigation active states
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
