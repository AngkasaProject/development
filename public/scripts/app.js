// ====================================================================
// A. FUNGSI UTILITY (COPY, MODAL)
// ====================================================================

function initializeFloatingMenu() {
  const items = document.querySelectorAll('#floating-menu a')
  // Mengatur status awal semua item agar bertumpuk, tidak terlihat, dan tidak bisa diklik.
  items.forEach((item) => {
    item.style.transform = 'translate(0, 0)'
    item.style.opacity = '0'
    item.style.pointerEvents = 'none'
  })
}

let isFloatingMenuOpen = false

function toggleFloatingMenu() {
  const trigger = document.getElementById('floating-menu-trigger')
  const icon = document.getElementById('trigger-icon')
  const bottomNavbar = document.getElementById('bottom-navbar')
  const creditFooter = document.getElementById('credit-footer')

  if (!trigger || !icon || !bottomNavbar || !creditFooter) return

  // Toggle status
  isFloatingMenuOpen = !isFloatingMenuOpen

  if (isFloatingMenuOpen) {
    // SCENARIO: BUKA MENU (Sesuai permintaan: Tampilkan Navbar & Sembunyikan Footer)

    // 1. Ganti Ikon dari '+' menjadi 'X'
    icon.classList.remove('fa-bars')
    icon.classList.add('fa-times')
    icon.style.transform = ''

    // 2. Tampilkan Navbar (Menu Bawah)
    bottomNavbar.classList.remove('opacity-0')
    bottomNavbar.classList.add('opacity-100')

    // 3. Sembunyikan Footer (credit-footer)
    creditFooter.classList.add('opacity-0', 'pointer-events-none')
    creditFooter.classList.remove('opacity-100', 'pointer-events-auto')
  } else {
    // SCENARIO: TUTUP MENU (Kembalikan ke kondisi awal)

    // 1. Ganti Ikon dari 'X' menjadi '+'
    icon.classList.remove('fa-times')
    icon.classList.add('fa-bars')

    // 2. Sembunyikan Navbar (Menu Bawah)
    bottomNavbar.classList.remove('opacity-100')
    bottomNavbar.classList.add('opacity-0')

    // 3. Tampilkan Footer (credit-footer)
    creditFooter.classList.remove('opacity-0', 'pointer-events-none')
    creditFooter.classList.add('opacity-100', 'pointer-events-auto')
  }
}
window.toggleFloatingMenu = toggleFloatingMenu

async function copyToClipboard(textToCopy, buttonId) {
  const button = document.getElementById(buttonId)
  if (!button) return

  // Membersihkan teks: menghapus spasi, koma, dsb., agar hanya angka
  const cleanedText = textToCopy.replace(/[-\s,]/g, '')
  const originalText = button.innerHTML

  const showFeedback = () => {
    // Feedback visual
    button.innerHTML = '<i class="fas fa-check mr-1"></i> Tersalin!'
    button.classList.add('text-green-500')

    // Kembalikan teks tombol
    setTimeout(() => {
      button.innerHTML = originalText
      button.classList.remove('text-green-500')
    }, 2000)
  }

  try {
    // 1. Coba Clipboard API (Modern)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(cleanedText)
      showFeedback()
      return
    }

    // 2. Fallback jika Clipboard API gagal atau tidak didukung
    throw new Error('Fallback required')
  } catch (err) {
    // Fallback: execCommand (deprecated, tetapi berfungsi di browser lama/iframe)
    const tempInput = document.createElement('input')
    tempInput.value = cleanedText
    document.body.appendChild(tempInput)

    tempInput.select()
    tempInput.setSelectionRange(0, 99999)

    document.execCommand('copy')
    document.body.removeChild(tempInput)

    showFeedback()
    console.warn('Menggunakan fallback copyToClipboard.')
  }
}

window.copyToClipboard = copyToClipboard

function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  if (modalId === 'gift-modal') {
    renderModalGiftDetails()
  }

  modal.classList.remove('hidden')

  setTimeout(() => {
    modal.classList.add('opacity-100')
    const modalContent = modal.querySelector('.modal-content')
    if (modalContent) {
      modalContent.classList.remove('scale-95')
      modalContent.classList.add('scale-100')
    }
  }, 10)

  document.body.style.overflow = 'hidden'
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  modal.classList.remove('opacity-100')
  const modalContent = modal.querySelector('.modal-content')
  if (modalContent) {
    modalContent.classList.add('scale-95')
    modalContent.classList.remove('scale-100')
  }

  setTimeout(() => {
    modal.classList.add('hidden')
    document.body.style.overflow = ''
  }, 300)
}

function copyAndClose(textToCopy, buttonId, modalId) {
  copyToClipboard(textToCopy, buttonId)
  setTimeout(() => {
    closeModal(modalId)
  }, 400)
}

window.openModal = openModal
window.closeModal = closeModal
window.copyAndClose = copyAndClose
window.copyToClipboard = copyToClipboard

// ====================================================================
// B. FUNGSI NAMA TAMU DARI URL
// ====================================================================

function getGuestNameFromUrl() {
  const params = new URLSearchParams(window.location.search)
  let guestName = params.get('to') || params.get('nama')

  if (guestName) {
    // Mengganti semua tanda '+' dengan spasi, lalu decode URI
    guestName = decodeURIComponent(guestName.replace(/\+/g, ' '))
    return guestName
  }
  return null
}

function displayGuestName() {
  const guestName = getGuestNameFromUrl()
  const displayElement = document.getElementById('guest-name-display')

  if (displayElement) {
    // Default text jika tidak ada nama di URL
    displayElement.innerText = guestName || 'Tamu Undangan'
  }
}

// ====================================================================
// D. FUNGSI KONTROL MUSIK
// ====================================================================

let globalUpdatePauseIcon
let globalUpdateMuteIcon
let globalIsPlaying = false

function initializeMusicControl() {
  const music = document.getElementById('background-music')
  const pauseButton = document.getElementById('music-pause-button')
  const muteButton = document.getElementById('music-mute-button')
  const pauseIcon = document.getElementById('pause-icon')
  const muteIcon = document.getElementById('mute-icon')

  if (!music || !pauseButton || !muteButton || !pauseIcon || !muteIcon) return

  // Mendefinisikan fungsi update dan menyimpannya ke variabel global
  function updatePauseIcon(playing) {
    if (playing) {
      pauseIcon.classList.remove('fa-play')
      pauseIcon.classList.add('fa-pause')
    } else {
      pauseIcon.classList.remove('fa-pause')
      pauseIcon.classList.add('fa-play')
    }
  }

  function updateMuteIcon(muted) {
    if (muted) {
      muteIcon.classList.remove('fa-volume-up')
      muteIcon.classList.add('fa-volume-mute')
    } else {
      muteIcon.classList.remove('fa-volume-mute')
      muteIcon.classList.add('fa-volume-up')
    }
  }

  // Assign ke variabel global agar bisa diakses di luar fungsi ini (di DOMContentLoaded)
  globalUpdatePauseIcon = updatePauseIcon
  globalUpdateMuteIcon = updateMuteIcon

  function autoPlayAfterInteraction() {
    if (!globalIsPlaying && music) {
      music.volume = 0.5
      music
        .play()
        .then(() => {
          globalIsPlaying = true
          updatePauseIcon(true)
          updateMuteIcon(music.muted)
        })
        .catch((error) => {
          console.log('Autoplay diblokir:', error)
          updatePauseIcon(false)
        })
      // Hapus listener setelah interaksi pertama
      document.removeEventListener('click', autoPlayAfterInteraction, true)
      document.removeEventListener('touchstart', autoPlayAfterInteraction, true)
    }
  }

  // 1. Initial interaction listener for Autoplay (Click/Touch)
  document.addEventListener('click', autoPlayAfterInteraction, {
    once: true,
    capture: true
  })
  document.addEventListener('touchstart', autoPlayAfterInteraction, {
    once: true,
    capture: true
  })

  // 2. Play/Pause Listener
  pauseButton.addEventListener('click', (e) => {
    e.stopPropagation()
    if (music.paused) {
      music
        .play()
        .then(() => {
          globalIsPlaying = true
          updatePauseIcon(true)
        })
        .catch((error) => {
          console.error('Music play failed on click:', error)
          updatePauseIcon(false)
        })
    } else {
      music.pause()
      globalIsPlaying = false
      updatePauseIcon(false)
    }
  })

  // 3. Mute/Unmute Listener
  muteButton.addEventListener('click', (e) => {
    e.stopPropagation()
    music.muted = !music.muted
    updateMuteIcon(music.muted)
  })

  // Set Initial state
  updatePauseIcon(false)
  updateMuteIcon(music.muted)
}

// ====================================================================
// E. FUNGSI SCROLL, NAVIGASI & OBSERVER
// ====================================================================

let mobileWrapper
let observer

function isMobileView() {
  return window.innerWidth <= 768
}

function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

function triggerOrnamentAnimation(sectionElement) {
  if (!sectionElement) return

  // 1. Reset ALL ornaments' animation classes globally (important for re-triggering)
  document.querySelectorAll('.ornament-item').forEach((item) => {
    item.classList.remove('animate__animated')
    const animationClass = item.getAttribute('data-animation-class')
    if (animationClass) {
      item.classList.remove(animationClass)
    }
  })

  // 2. Apply animation to ornaments in the current section
  setTimeout(() => {
    sectionElement.querySelectorAll('.ornament-item').forEach((item) => {
      const animationClass = item.getAttribute('data-animation-class')
      if (animationClass) {
        item.classList.add('animate__animated', animationClass)
      }
    })
  }, 50)
}

function updateNavbarActiveState(sectionId) {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.remove('active-nav-style')
  })

  const activeLink = document.getElementById(`nav-${sectionId}`)
  if (activeLink) {
    activeLink.classList.add('active-nav-style')
    centerActiveNavItem(sectionId)
  }
}

function centerActiveNavItem(itemId) {
  const navContainer = document.querySelector('#bottom-navbar > div')
  const activeItem = document.getElementById(`nav-${itemId}`)

  if (!activeItem || !navContainer) return

  const scrollPosition =
    activeItem.offsetLeft - navContainer.clientWidth / 2 + activeItem.offsetWidth / 2

  navContainer.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  })
}

function scrollToSection(event, sectionId) {
  event.preventDefault()
  const targetSection = document.getElementById(sectionId)

  if (targetSection && mobileWrapper && mobileWrapper.style.overflowY !== 'hidden') {
    mobileWrapper.scrollTo({
      top: targetSection.offsetTop,
      behavior: 'smooth'
    })

    updateNavbarActiveState(sectionId)
    centerActiveNavItem(sectionId)

    document.querySelectorAll('.angkasa_slide').forEach((sec) => sec.classList.remove('is-active'))
    targetSection.classList.add('is-active')
    triggerOrnamentAnimation(targetSection)
  }
}
window.scrollToSection = scrollToSection

// ====================================================================
// F. FUNGSI PRELOADER (Anti-Flicker & Fungsional) - LOGIK BARU
// ====================================================================

function handlePreloader() {
  const preloader = document.getElementById('preloader')
  if (!preloader) {
    console.error("Preloader element with ID 'preloader' tidak ditemukan.")
    return
  }

  let loadFired = false
  let minTimeElapsed = false
  let hasHidden = false
  const MIN_DISPLAY_TIME = 2000 // 2 detik minimum tampilan
  const MAX_WAIT_TIME = 8000 // 8 detik maksimum sebagai JAMINAN fallback

  const hidePreloaderVisuals = () => {
    if (hasHidden) return
    hasHidden = true

    // LANGKAH 1: Mulai efek fade-out
    preloader.classList.add('opacity-0')

    // LANGKAH 2: Nonaktifkan interaksi klik (PENTING!)
    preloader.style.pointerEvents = 'none'

    // LANGKAH 3: Sembunyikan sepenuhnya setelah transisi (0.5s)
    setTimeout(() => {
      preloader.classList.add('hidden')
    }, 500)
  }

  const attemptHide = () => {
    // Hanya sembunyikan jika MIN_TIME sudah berlalu DAN semua aset sudah dimuat
    if (loadFired && minTimeElapsed) {
      hidePreloaderVisuals()
    }
  }

  // --- 1. MINIMUM TIME TIMER (Mulai segera saat DOM siap) ---
  // Timer ini memastikan preloader tampil setidaknya 2 detik
  setTimeout(() => {
    minTimeElapsed = true
    attemptHide()
  }, MIN_DISPLAY_TIME)

  // --- 2. WINDOW LOAD EVENT (Menunggu semua aset) ---
  window.addEventListener(
    'load',
    () => {
      loadFired = true
      attemptHide()
    },
    { once: true }
  )

  // --- 3. FALLBACK GUARANTEE (Jaminan hilang setelah MAX_WAIT_TIME) ---
  // Jika load event diblokir (kemungkinan besar penyebab masalah Anda), ini akan memaksa preloader hilang.
  setTimeout(() => {
    if (!hasHidden) {
      console.warn('Preloader dipaksa hilang setelah 8 detik. Mungkin ada aset yang terblokir.')
      hidePreloaderVisuals()
    }
  }, MAX_WAIT_TIME)
}

// ====================================================================
// H. INJEKSI DATA KONFIGURASI STATIS (FIX TEMPLATING)
// ====================================================================
function injectConfigData() {
  // Pastikan UNDANGAN_CONFIG tersedia secara global
  if (typeof UNDANGAN_CONFIG === 'undefined') {
    console.error('Configuration data (UNDANGAN_CONFIG) is not available.')
    return
  }
  const config = UNDANGAN_CONFIG

  // Helper untuk mendapatkan inisial
  const initials = `${config.brideName[0]} & ${config.groomName[0]}`

  // --- PRELOADER & FOOTER ---
  const initialsDisplayEl = document.getElementById('initials-display')
  if (initialsDisplayEl) {
    initialsDisplayEl.innerText = initials
  }

  const footerInitialsEl = document.getElementById('footer-initials')
  if (footerInitialsEl) {
    footerInitialsEl.innerText = initials
  }

  // --- COVER SECTION (HEADER) ---
  const brideNameCoverEl = document.getElementById('bride-name-cover-display')
  const groomNameCoverEl = document.getElementById('groom-name-cover-display')
  if (brideNameCoverEl) {
    brideNameCoverEl.innerText = config.brideName
  }
  if (groomNameCoverEl) {
    groomNameCoverEl.innerText = config.groomName
  }

  // Tanggal
  const dateDisplayEl = document.getElementById('date-display')
  if (dateDisplayEl) {
    dateDisplayEl.innerText = config.date
  }

  // --- QUOTE SECTION ---
  const quoteTextEl = document.getElementById('quote-text')
  const quoteSourceEl = document.getElementById('quote-source')
  if (quoteTextEl && config.quote && config.quote.text) {
    quoteTextEl.innerText = config.quote.text
  }
  if (quoteSourceEl && config.quote && config.quote.source) {
    quoteSourceEl.innerText = config.quote.source
  }

  // --- BRIDE/GROOM PROFILE SECTION (Revisi Logika FullName) ---
  const groomFullNameEl = document.getElementById('groom-full-name')
  const groomNicknameEl = document.getElementById('groom-nickname')
  const brideFullNameEl = document.getElementById('bride-full-name')
  const brideNicknameEl = document.getElementById('bride-nickname')

  // Jika config.groomFullName tidak didefinisikan (null/undefined), gunakan config.groomName sebagai fallback
  const finalGroomFullName = config.groomFullName || config.groomName
  const finalBrideFullName = config.brideFullName || config.brideName

  if (groomFullNameEl) {
    groomFullNameEl.innerText = finalGroomFullName
  }
  if (groomNicknameEl) {
    groomNicknameEl.innerText = config.groomName // Selalu gunakan nama panggilan
  }
  if (brideFullNameEl) {
    brideFullNameEl.innerText = finalBrideFullName
  }
  if (brideNicknameEl) {
    brideNicknameEl.innerText = config.brideName // Selalu gunakan nama panggilan
  }

  // --- DETAIL ORANG TUA ---
  const brideParentEl = document.getElementById('bride-parent-display')
  const groomParentEl = document.getElementById('groom-parent-display')

  if (brideParentEl) {
    brideParentEl.innerText = `${config.brideParent.father} & ${config.brideParent.mother}`
  }
  if (groomParentEl) {
    groomParentEl.innerText = `${config.groomParent.father} & ${config.groomParent.mother}`
  }

  // --- MODAL FISIK ---
  const physicalModalAddressEl = document.getElementById('modal-physical-address')
  if (physicalModalAddressEl) {
    physicalModalAddressEl.innerText = config.physicalGift.address
  }

  // Update Tombol Salin Alamat Fisik di Modal
  const addressToCopy = `Penerima: ${config.physicalGift.name}. No. Telp: ${config.physicalGift.phone}. Alamat: ${config.physicalGift.address}`
  const copyAddressButton = document.getElementById('alamat-fisik-btn')
  if (copyAddressButton) {
    // Karena menggunakan event handler inline, kita hanya perlu memastikan teks yang disalin benar
    copyAddressButton.setAttribute(
      'onclick',
      `copyAndClose('${addressToCopy}', 'alamat-fisik-btn', 'modal-fisik')`
    )
  }
}

// ====================================================================
// G. INISIALISASI UTAMA (DOMContentLoaded)
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render data dinamis dari config ke HTML

  mobileWrapper = document.getElementById('mobile-wrapper')
  const bottomNavbar = document.getElementById('bottom-navbar')
  const openButton = document.getElementById('open-button')
  const fullscreenTarget = document.getElementById('fullscreen-container')
  const musicControls = document.getElementById('floating-music-controls')
  const music = document.getElementById('background-music')
  const collapseButton = document.getElementById('navbar-collapse-button')
  const creditFooter = document.getElementById('credit-footer')

  if (bottomNavbar) bottomNavbar.classList.add('transition-all', 'duration-500')
  if (creditFooter) creditFooter.classList.add('transition-all', 'duration-500')

  if (!mobileWrapper || !bottomNavbar || !openButton) {
    console.error('DOM Initialization Failed: One or more critical elements are missing.')
    return
  }

  // 3. Tampilkan Nama Tamu & Kontrol Musik
  displayGuestName()
  initializeMusicControl()
  initializeFloatingMenu()

  // 4. Mulai Preloader (Sekarang lebih tangguh!)
  handlePreloader()

  // 5. INISIALISASI INTERSECTION OBSERVER (HANYA UNTUK NAVIGASI & ORNAMEN)
  const observerOptions = {
    root: mobileWrapper,
    rootMargin: '0px',
    threshold: 0.8
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target
      const sectionId = section.getAttribute('id')
      const creditFooter = document.getElementById('credit-footer')

      if (entry.isIntersecting) {
        if (sectionId) {
          updateNavbarActiveState(sectionId)
        }

        section.classList.add('is-active')

        // Trigger ornament animation on natural scroll (TETAP ADA)
        triggerOrnamentAnimation(section)
      }
      if (entry.target.id === 'closing') {
        const trigger = document.getElementById('floating-menu-trigger')
        const menu = document.getElementById('floating-menu')

        if (entry.isIntersecting) {
          // Sesi Penutup Terlihat: Sembunyikan Bottom Navbar & Tampilkan Trigger

          // 1. COLLAPSE: Sembunyikan Bottom Navbar Penuh
          bottomNavbar.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto')
          bottomNavbar.classList.add('opacity-0', 'pointer-events-none')

          // Jika menu sedang terbuka, tutup dulu sebelum navbar hilang
          if (isFloatingMenuOpen) {
            toggleFloatingMenu()
          }

          // 2. Tampilkan Trigger (AssistiveTouch)
          trigger.classList.remove('opacity-0', 'pointer-events-none')
          trigger.classList.add('opacity-100', 'pointer-events-auto')

          // 3. Tampilkan Footer
          creditFooter.classList.remove('opacity-0', 'pointer-events-none')
          creditFooter.classList.add('opacity-100', 'pointer-events-auto')
        } else {
          // Keluar dari Sesi Penutup: Tampilkan Bottom Navbar & Sembunyikan Trigger

          // 1. Tampilkan Navbar Penuh
          bottomNavbar.classList.remove('opacity-0', 'pointer-events-none')
          bottomNavbar.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto')

          // 2. Sembunyikan Trigger (dan pastikan menu tertutup)
          if (isFloatingMenuOpen) {
            toggleFloatingMenu()
          }
          trigger.classList.remove('opacity-100', 'pointer-events-auto')
          trigger.classList.add('opacity-0', 'pointer-events-none')

          // 3. Sembunyikan Footer
          creditFooter.classList.remove('opacity-100', 'pointer-events-auto')
          creditFooter.classList.add('opacity-0', 'pointer-events-none')
        }
      }
    })
  }, observerOptions)

  const floatingMenuItems = document.querySelectorAll('#floating-menu a')
  floatingMenuItems.forEach((item) => {
    item.addEventListener('click', function (e) {
      e.preventDefault()

      // Tutup menu segera
      toggleFloatingMenu()

      // Dapatkan target ID dari href
      const targetId = this.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      const mobileWrapper = document.getElementById('mobile-wrapper')

      if (targetElement && mobileWrapper) {
        // Scroll ke section
        mobileWrapper.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        })
      }
    })
  })

  // 6. LISTENER TOMBOL BUKA UNDANGAN (Slide Up Logic)
  openButton.addEventListener('click', function () {
    const isMobile = isMobileView()
    const coverSectionOverlay = document.getElementById('cover-section-overlay')

    if (musicControls) {
      musicControls.classList.remove('hidden', 'opacity-0')
      musicControls.classList.add('opacity-100')
    }

    // --- PERBAIKAN: Memutar musik dan memastikan ikon diperbarui ---
    if (music) {
      music
        .play()
        .then(() => {
          // Hanya jika pemutaran berhasil, perbarui status dan ikon
          globalIsPlaying = true
          if (globalUpdatePauseIcon) {
            globalUpdatePauseIcon(true)
          }
        })
        .catch((e) => console.error('Music play blocked:', e))
    }
    // --- AKHIR PERBAIKAN ---

    // Launch fullscreen only if user grants permission
    if (isMobile && fullscreenTarget) {
      launchFullscreen(document.documentElement)
    }

    coverSectionOverlay.style.transform = 'translateY(-100%)'
    openButton.classList.add('hidden')

    setTimeout(() => {
      coverSectionOverlay.classList.add('hidden')

      mobileWrapper.style.overflowY = 'scroll'
      mobileWrapper.style.scrollSnapType = 'y mandatory'

      const firstSectionId = 'cover'
      const targetSection = document.getElementById(firstSectionId)

      document.querySelectorAll('.angkasa_slide').forEach((section) => {
        section.classList.add('scroll-active-section')
        observer.observe(section)
      })

      if (targetSection) {
        // Scroll to the first section after the overlay is hidden
        mobileWrapper.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        })

        updateNavbarActiveState(firstSectionId)
        targetSection.classList.add('is-active')
        triggerOrnamentAnimation(targetSection)
      }

      const bottomNavbar = document.getElementById('bottom-navbar')
      if (bottomNavbar.classList.contains('hidden')) {
        bottomNavbar.classList.remove('hidden')
      }
      bottomNavbar.classList.remove('translate-y-full')
      bottomNavbar.classList.add('translate-y-0')
    }, 750)
  })
})
