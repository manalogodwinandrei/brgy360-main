/**
 * Brgy360 - Resident Portal Script (user.js)
 * Single-Page Architecture (SPA) Tab Routing, State Management,
 * Form Validation, and Local Storage Persistence.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ==========================================================
  // 1. DATA INITIALIZATION & LOCALSTORAGE MANAGEMENT
  // ==========================================================

  const DEFAULT_USER = {
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@example.com',
    mobile: '0917 123 4567',
    dob: '1992-06-15',
    civilStatus: 'Single',
    address: '142 Pallocan Blvd, Barangay Pallocan West',
    sitio: 'Sitio Ibaba',
    city: 'Batangas City, Batangas',
    residentId: 'PW-2026-08492',
    registeredVoter: 'Yes (Precinct 0142A)',
    verified: true,
    verificationTier: 'Level 2: Fully Verified Resident',
    idOnRecord: 'Philippine National ID (PhilID) • ****-****-8492',
    avatarInitial: 'J'
  };

  const DEFAULT_SERVICES = [
    {
      id: 'clearance',
      name: 'Barangay Clearance',
      fee: '₱50.00',
      isFree: false,
      turnaround: '1–2 Working Days',
      desc: 'Official clearance certifying good moral character and no pending derogatory record in Barangay Pallocan West.',
      requirements: 'Valid Govt ID, Cedula / Community Tax Certificate'
    },
    {
      id: 'residency',
      name: 'Certificate of Residency',
      fee: '₱50.00',
      isFree: false,
      turnaround: '1–2 Working Days',
      desc: 'Attestation that the applicant is a bonafide resident living at their declared address in the barangay.',
      requirements: 'Proof of Address / Utility bill, 1 Valid ID'
    },
    {
      id: 'indigency',
      name: 'Certificate of Indigency',
      fee: 'FREE',
      isFree: true,
      turnaround: 'Same Day / 1 Day',
      desc: 'Issued to low-income residents for medical, financial, burial, educational, or legal assistance.',
      requirements: 'Case study referral or Purok Leader certification'
    },
    {
      id: 'business',
      name: 'Barangay Business Clearance',
      fee: '₱200.00',
      isFree: false,
      turnaround: '2–3 Working Days',
      desc: 'Prerequisite clearance for commercial establishments, sari-sari stores, and enterprises operating in Pallocan West.',
      requirements: 'DTI / SEC Registration, Contract of Lease / Land Title'
    },
    {
      id: 'jobseeker',
      name: 'First-Time Jobseeker (RA 11261)',
      fee: 'FREE',
      isFree: true,
      turnaround: '1 Working Day',
      desc: 'Issued free of charge under RA 11261 to first-time jobseekers applying for government credentials.',
      requirements: 'Oath of Undertaking signed before Punong Barangay'
    },
    {
      id: 'mediation',
      name: 'Katarungang Pambarangay Mediation',
      fee: 'FREE',
      isFree: true,
      turnaround: '3–5 Working Days',
      desc: 'Formal filing for amicable community dispute conciliation before the Lupon Tagapamayapa.',
      requirements: 'Complete narrative of complaint and parties involved'
    }
  ];

  const DEFAULT_REQUESTS = [
    {
      ref: 'BRGY-84291',
      docType: 'Barangay Clearance',
      purpose: 'Local Employment (SM Batangas City application)',
      dateFiled: '2026-10-02',
      claimMethod: 'Physical Pickup at Barangay Hall',
      claimTarget: 'October 5, 2026 (Window 2)',
      status: 'Ready for Pickup',
      notes: 'Cleared by Lupong Tagapamayapa. Document printed and sealed. Ready for collection.'
    },
    {
      ref: 'BRGY-81409',
      docType: 'First-Time Jobseeker (RA 11261)',
      purpose: 'Pre-Employment NBI Clearance requirement',
      dateFiled: '2026-10-03',
      claimMethod: 'Physical Pickup at Barangay Hall',
      claimTarget: 'October 6, 2026 (Window 2)',
      status: 'In Review',
      notes: 'Under review by Barangay Secretary for RA 11261 qualification check.'
    },
    {
      ref: 'BRGY-79104',
      docType: 'Certificate of Residency',
      purpose: 'Bank Account Opening (BDO Batangas)',
      dateFiled: '2026-09-15',
      claimMethod: 'Physical Pickup at Barangay Hall',
      claimTarget: 'September 16, 2026',
      status: 'Completed',
      notes: 'Claimed by resident on September 16, 2026. Official Receipt #84920.'
    }
  ];

  const DEFAULT_CONCERNS = [
    {
      ref: 'TCK-4021',
      category: 'Infrastructure',
      urgency: 'Standard',
      location: 'Corner of Acacia St. & Main Road, Purok 3',
      dateFiled: '2026-10-01',
      status: 'In Review',
      currentStage: 2, // 1: New, 2: In Review, 3: Resolved
      desc: 'Streetlight has been flickering and completely goes dark after 8:00 PM. Creates a blind spot for pedestrians and students walking home at night.',
      resolutionNote: 'Inspected by BPSO Night Patrol on Oct 2. Reported to City Engineering Public Lighting Office. Replacement LED fixture scheduled for Oct 6.'
    },
    {
      ref: 'TCK-3890',
      category: 'Sanitation',
      urgency: 'Standard',
      location: 'Purok 3 near Basketball Court alley',
      dateFiled: '2026-09-22',
      status: 'Resolved',
      currentStage: 3,
      desc: 'Piles of branch trimmings and garden waste left on sidewalk obstructing pedestrian pathway.',
      resolutionNote: 'Barangay Green Waste collection truck dispatched on Sep 23, 10:30 AM. Area cleared and sidewalk disinfected.'
    },
    {
      ref: 'TCK-3412',
      category: 'Public Safety',
      urgency: 'Urgent',
      location: 'School Access Path, Purok 3',
      dateFiled: '2026-09-08',
      status: 'Resolved',
      currentStage: 3,
      desc: 'Unleashed aggressive dogs barking and chasing students walking to Pallocan West Elementary.',
      resolutionNote: 'Joint operation by Barangay Tanod and City Veterinary Office on Sep 9. Dog owners notified and issued citation; safety patrol instituted during school hours.'
    }
  ];

  const DEFAULT_PROPOSALS = [
    {
      ref: 'PROP-8421',
      title: 'Installation of Solar LED Streetlights along Purok 3 Riverbank Walkway',
      category: 'Infrastructure',
      location: 'Purok 3 Riverbank Walkway (150-meter stretch)',
      budget: 150000,
      timeline: 'Q1 2027 (3 months implementation)',
      dateFiled: '2026-09-28',
      status: 'Under BDC Review',
      rationale: 'The riverbank pathway is heavily traversed by over 300 residents daily but lacks grid electricity. Standalone solar lights provide clean, zero-grid-cost illumination to prevent accidents and deter nighttime criminality.',
      councilNote: 'Endorsed for technical site survey by the Committee on Infrastructure. Calendar for prioritization during the Barangay Assembly Deliberation.'
    }
  ];

  const DEFAULT_NOTIFS = [
    {
      id: 1,
      title: 'Request Ready for Pickup',
      desc: 'Your Barangay Clearance (BRGY-84291) is approved and signed. Claim at Window 2.',
      time: '2 hours ago',
      unread: true,
      type: 'blue'
    },
    {
      id: 2,
      title: 'Concern Site Inspection Completed',
      desc: 'BPSO Team completed site validation on concern TCK-4021 (Streetlight repair).',
      time: '1 day ago',
      unread: true,
      type: 'amber'
    },
    {
      id: 3,
      title: 'Typhoon Advisory Level 1',
      desc: 'Barangay Disaster Risk Council issues alert for heavy rains. Hotline: 0917-888-BRGY.',
      time: '2 days ago',
      unread: true,
      type: 'green'
    }
  ];

  // Helper to load or initialize localStorage
  function loadData(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading data for key ' + key, e);
      return fallback;
    }
  }

  function saveData(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Error saving data for key ' + key, e);
    }
  }

  // Load app state
  let currentUser = loadData('brgy360_user', DEFAULT_USER);
  let userRequests = loadData('brgy360_requests', DEFAULT_REQUESTS);
  let userConcerns = loadData('brgy360_concerns', DEFAULT_CONCERNS);
  let userProposals = loadData('brgy360_proposals', DEFAULT_PROPOSALS);
  let userNotifications = loadData('brgy360_notifs', DEFAULT_NOTIFS);

  // Set active session
  localStorage.setItem('brgy360_session', 'active');

  // ==========================================================
  // 2. DOM ELEMENT SELECTORS
  // ==========================================================

  // Tab buttons and panels
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link');
  const userTabPanels = document.querySelectorAll('.user-tab-panel');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');

  // Topbar dropdowns
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const notifCountBadge = document.getElementById('notifCountBadge');
  const notifUnreadCount = document.getElementById('notifUnreadCount');
  const markAllReadBtn = document.getElementById('markAllReadBtn');

  const userProfileBtn = document.getElementById('userProfileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const topbarLogoutBtn = document.getElementById('topbarLogoutBtn');
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

  // Mobile sidebar
  const sidebarToggle = document.getElementById('sidebarToggle');
  const userSidebar = document.getElementById('userSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Toast
  const portalToast = document.getElementById('portalToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  let toastTimer = null;

  // Modals
  const docRequestModal = document.getElementById('docRequestModal');
  const closeDocModalBtn = document.getElementById('closeDocModalBtn');
  const btnCancelDocModal = document.getElementById('btnCancelDocModal');
  const btnOpenNewDocModal = document.getElementById('btnOpenNewDocModal');
  const docApplicationForm = document.getElementById('docApplicationForm');
  const modalDocType = document.getElementById('modalDocType');

  const concernModal = document.getElementById('concernModal');
  const closeConcernModalBtn = document.getElementById('closeConcernModalBtn');
  const btnCancelConcernModal = document.getElementById('btnCancelConcernModal');
  const btnOpenNewConcernModal = document.getElementById('btnOpenNewConcernModal');
  const concernReportForm = document.getElementById('concernReportForm');

  const proposalModal = document.getElementById('proposalModal');
  const closeProposalModalBtn = document.getElementById('closeProposalModalBtn');
  const btnCancelPropModal = document.getElementById('btnCancelPropModal');
  const btnOpenNewProposalModal = document.getElementById('btnOpenNewProposalModal');
  const proposalSubmitForm = document.getElementById('proposalSubmitForm');

  const detailViewerModal = document.getElementById('detailViewerModal');
  const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
  const detailModalTitle = document.getElementById('detailModalTitle');
  const detailModalKicker = document.getElementById('detailModalKicker');
  const detailModalBody = document.getElementById('detailModalBody');

  // Confirmation Modal Elements
  const actionConfirmModal = document.getElementById('actionConfirmModal');
  const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
  const btnCancelConfirmModal = document.getElementById('btnCancelConfirmModal');
  const btnExecuteConfirmAction = document.getElementById('btnExecuteConfirmAction');
  const confirmModalKicker = document.getElementById('confirmModalKicker');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalIconBox = document.getElementById('confirmModalIconBox');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const confirmModalDetailsBox = document.getElementById('confirmModalDetailsBox');

  let pendingActionCallback = null;

  // Quick Action triggers on dashboard
  const btnDashNewRequest = document.getElementById('btnDashNewRequest');
  const btnDashNewConcern = document.getElementById('btnDashNewConcern');
  const scRequestDoc = document.getElementById('scRequestDoc');
  const scFileConcern = document.getElementById('scFileConcern');
  const scProposeProj = document.getElementById('scProposeProj');

  // Account forms
  const updateProfileForm = document.getElementById('updateProfileForm');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const idUploadForm = document.getElementById('idUploadForm');

  // File input labels
  const modalDocAttachment = document.getElementById('modalDocAttachment');
  const modalDocAttachmentName = document.getElementById('modalDocAttachmentName');
  const modalConcernPhoto = document.getElementById('modalConcernPhoto');
  const modalConcernPhotoName = document.getElementById('modalConcernPhotoName');
  const newIdFile = document.getElementById('newIdFile');
  const newIdFileName = document.getElementById('newIdFileName');

  // ==========================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================================

  function showToast(title, desc, isError = false) {
    if (!portalToast) return;
    if (toastTimer) clearTimeout(toastTimer);

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    portalToast.style.display = 'flex';
    portalToast.style.borderColor = isError ? '#fecaca' : '#bbf7d0';

    const iconWrap = document.getElementById('toastIcon');
    if (iconWrap) {
      iconWrap.style.background = isError ? '#dc2626' : '#16a34a';
    }

    toastTimer = setTimeout(function () {
      portalToast.style.display = 'none';
    }, 4000);
  }

  // ==========================================================
  // 4. TAB ROUTING (SPA NAVIGATION)
  // ==========================================================

  const TAB_NAMES = {
    dashboard: 'Dashboard Home',
    services: 'My Service Requests',
    reports: 'My Concerns & Complaints',
    proposals: 'Propose a Project',
    account: 'My Account & Verification'
  };

  function switchTab(tabId) {
    if (!tabId || !TAB_NAMES[tabId]) tabId = 'dashboard';

    // Update active nav links
    sidebarNavLinks.forEach(function (link) {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update active panels
    userTabPanels.forEach(function (panel) {
      if (panel.id === 'user-' + tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update breadcrumb
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = TAB_NAMES[tabId];
    }

    // Update URL hash without full reload
    window.location.hash = tabId;

    // Close mobile drawer if open
    closeMobileSidebar();

    // Scroll to top of main viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.getElementById('userMain');
    if (mainEl) mainEl.scrollTop = 0;
  }

  // Attach click listeners to sidebar tabs
  sidebarNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      const tab = this.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Attach click listeners to any element with data-goto-tab
  document.querySelectorAll('[data-goto-tab]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const targetTab = this.getAttribute('data-goto-tab');
      switchTab(targetTab);
      // Close profile dropdown if open
      if (profileDropdown) profileDropdown.classList.remove('active');
    });
  });

  // Handle URL hash on page load
  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && TAB_NAMES[hash]) {
      switchTab(hash);
    } else {
      switchTab('dashboard');
    }
  }

  window.addEventListener('hashchange', function () {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && TAB_NAMES[hash]) {
      switchTab(hash);
    }
  });

  // ==========================================================
  // 5. MOBILE DRAWER NAVIGATION
  // ==========================================================

  function openMobileSidebar() {
    if (userSidebar) userSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (userSidebar) userSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      if (userSidebar && userSidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // ==========================================================
  // 6. TOPBAR DROPDOWNS (NOTIFICATIONS & PROFILE)
  // ==========================================================

  function toggleDropdown(menu) {
    const isOpen = menu.classList.contains('active');
    // Close other dropdowns first
    if (notifDropdown) notifDropdown.classList.remove('active');
    if (profileDropdown) profileDropdown.classList.remove('active');

    if (!isOpen) {
      menu.classList.add('active');
    }
  }

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown(notifDropdown);
    });
  }

  if (userProfileBtn && profileDropdown) {
    userProfileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown(profileDropdown);
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function (e) {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
      notifDropdown.classList.remove('active');
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== userProfileBtn) {
      profileDropdown.classList.remove('active');
    }
  });

  // Render notifications
  function renderNotifications() {
    if (!notifList) return;
    const unreadCount = userNotifications.filter(n => n.unread).length;

    if (notifCountBadge) {
      notifCountBadge.textContent = unreadCount;
      notifCountBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (notifUnreadCount) {
      notifUnreadCount.textContent = unreadCount + ' unread notice' + (unreadCount === 1 ? '' : 's');
    }

    if (userNotifications.length === 0) {
      notifList.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">No notifications.</div>';
      return;
    }

    let html = '';
    userNotifications.forEach(function (n) {
      html += `
        <div class="notif-item ${n.unread ? 'unread' : ''}" data-notif-id="${n.id}">
          <div class="notif-item-icon ${n.type}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div class="notif-item-text">
            <h5 class="notif-item-title">${n.title}</h5>
            <p class="notif-item-desc">${n.desc}</p>
            <span class="notif-item-time">${n.time}</span>
          </div>
        </div>
      `;
    });
    notifList.innerHTML = html;

    // Attach click handler to mark individual as read
    notifList.querySelectorAll('.notif-item').forEach(function (item) {
      item.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-notif-id'), 10);
        const itemObj = userNotifications.find(n => n.id === id);
        if (itemObj) {
          itemObj.unread = false;
          saveData('brgy360_notifs', userNotifications);
          renderNotifications();
        }
      });
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', function () {
      userNotifications.forEach(n => { n.unread = false; });
      saveData('brgy360_notifs', userNotifications);
      renderNotifications();
      showToast('Notifications Updated', 'All notices marked as read.');
    });
  }

  // ==========================================================
  // 7. USER PROFILE SYNCHRONIZATION
  // ==========================================================

  function syncUserDisplays() {
    const name = currentUser.name || 'Juan Dela Cruz';
    const initial = currentUser.avatarInitial || name.charAt(0).toUpperCase();
    const sitio = currentUser.sitio || 'Sitio Ibaba';
    const email = currentUser.email || 'juan.delacruz@example.com';
    const mobile = currentUser.mobile || '0917 123 4567';
    const address = currentUser.address || 'Barangay Pallocan West';

    // Topbar
    const topbarAvatar = document.getElementById('topbarAvatar');
    const topbarUserName = document.getElementById('topbarUserName');
    if (topbarAvatar) topbarAvatar.textContent = initial;
    if (topbarUserName) topbarUserName.textContent = name;

    // Dropdown
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownAvatar) dropdownAvatar.textContent = initial;
    if (dropdownUserName) dropdownUserName.textContent = name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = email;

    // Sidebar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserStatus = document.getElementById('sidebarUserStatus');
    if (sidebarAvatar) sidebarAvatar.textContent = initial;
    if (sidebarUserName) sidebarUserName.textContent = name;
    if (sidebarUserStatus) sidebarUserStatus.textContent = 'Verified Resident • ' + sitio;

    // Dashboard Welcome
    const welcomeUserName = document.getElementById('welcomeUserName');
    const welcomeVerificationBadge = document.getElementById('welcomeVerificationBadge');
    if (welcomeUserName) welcomeUserName.textContent = name;
    if (welcomeVerificationBadge) welcomeVerificationBadge.textContent = 'Verified Resident • ' + sitio;

    // Account tab
    const accountAvatar = document.getElementById('accountAvatar');
    const accountFullName = document.getElementById('accountFullName');
    const accountSitio = document.getElementById('accountSitio');
    const accountDob = document.getElementById('accountDob');
    const accountGender = document.getElementById('accountGender');
    const accountCivilStatus = document.getElementById('accountCivilStatus');
    if (accountAvatar) accountAvatar.textContent = initial;
    if (accountFullName) accountFullName.textContent = name;
    if (accountSitio) accountSitio.textContent = sitio;
    if (accountDob) accountDob.textContent = currentUser.dob || 'June 15, 1992';
    if (accountGender) accountGender.textContent = currentUser.gender || 'Male';
    if (accountCivilStatus) accountCivilStatus.textContent = currentUser.civilStatus || 'Single';

    // Edit form inputs
    const profileMobile = document.getElementById('profileMobile');
    const profileEmail = document.getElementById('profileEmail');
    const profileAddress = document.getElementById('profileAddress');
    const profileSitio = document.getElementById('profileSitio');
    if (profileMobile) profileMobile.value = mobile;
    if (profileEmail) profileEmail.value = email;
    if (profileAddress) profileAddress.value = address;
    if (profileSitio) profileSitio.value = sitio;

    // Request Modal Prefills
    const modalDocFullName = document.getElementById('modalDocFullName');
    const modalDocMobile = document.getElementById('modalDocMobile');
    const modalDocSitio = document.getElementById('modalDocSitio');
    const modalDocAddress = document.getElementById('modalDocAddress');
    if (modalDocFullName) modalDocFullName.value = name;
    if (modalDocMobile) modalDocMobile.value = mobile;
    if (modalDocSitio) modalDocSitio.value = sitio;
    if (modalDocAddress) modalDocAddress.value = address;
  }

  // Date banner update
  function updateDateBanner() {
    const dateEl = document.getElementById('welcomeCurrentDate');
    if (!dateEl) return;
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-PH', options);
  }

  // ==========================================================
  // 8. RENDER DASHBOARD KPIS & ACTIVITY FEED
  // ==========================================================

  function renderDashboardKPIs() {
    // 1. Service requests
    const activeReqs = userRequests.filter(r => r.status !== 'Completed' && r.status !== 'Rejected' && r.status !== 'Cancelled');
    const kpiActiveRequests = document.getElementById('kpiActiveRequests');
    if (kpiActiveRequests) kpiActiveRequests.textContent = activeReqs.length;

    // Sidebar counter
    const sidebarServicesCount = document.getElementById('sidebarServicesCount');
    if (sidebarServicesCount) sidebarServicesCount.textContent = activeReqs.length;

    // 2. Concerns
    const kpiTotalConcerns = document.getElementById('kpiTotalConcerns');
    if (kpiTotalConcerns) kpiTotalConcerns.textContent = userConcerns.length;

    const inReviewConcerns = userConcerns.filter(c => c.status === 'In Review').length;
    const sidebarReportsCount = document.getElementById('sidebarReportsCount');
    if (sidebarReportsCount) sidebarReportsCount.textContent = inReviewConcerns;

    // 3. Proposals
    const kpiTotalProposals = document.getElementById('kpiTotalProposals');
    if (kpiTotalProposals) kpiTotalProposals.textContent = userProposals.length;
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Ready for Pickup': return 'status-ready';
      case 'In Review': return 'status-in-review';
      case 'Pending': return 'status-pending';
      case 'Completed': return 'status-completed';
      case 'Resolved': return 'status-resolved';
      case 'Cancelled': return 'status-cancelled';
      case 'Rejected':
      case 'Urgent': return 'status-urgent';
      default: return 'status-pending';
    }
  }

  function renderDashboardActivityTable() {
    const tbody = document.getElementById('dashActivityTableBody');
    if (!tbody) return;

    // Combine recent items
    const combined = [];

    userRequests.forEach(function (r) {
      combined.push({
        ref: r.ref,
        subject: r.docType,
        subtext: r.purpose,
        date: r.dateFiled,
        status: r.status,
        type: 'Service Request',
        raw: r
      });
    });

    userConcerns.forEach(function (c) {
      combined.push({
        ref: c.ref,
        subject: c.category + ' Issue',
        subtext: c.location,
        date: c.dateFiled,
        status: c.status,
        type: 'Citizen Concern',
        raw: c
      });
    });

    userProposals.forEach(function (p) {
      combined.push({
        ref: p.ref,
        subject: p.title,
        subtext: 'Budget: ₱' + Number(p.budget).toLocaleString(),
        date: p.dateFiled,
        status: p.status,
        type: 'Project Proposal',
        raw: p
      });
    });

    // Sort by date descending
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (combined.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 24px;">No recent transactions on record.</td></tr>';
      return;
    }

    let rowsHtml = '';
    combined.slice(0, 5).forEach(function (item) {
      const badgeClass = getStatusBadgeClass(item.status);
      rowsHtml += `
        <tr>
          <td style="vertical-align: middle;"><span class="table-ref-code">${item.ref}</span></td>
          <td style="vertical-align: middle;">
            <div class="table-subject-meta">
              <span class="table-subject-title">${item.subject}</span>
              <span class="table-subject-sub">${item.subtext}</span>
            </div>
          </td>
          <td style="white-space: nowrap; vertical-align: middle;">${item.date}</td>
          <td style="white-space: nowrap; vertical-align: middle;"><span class="status-pill ${badgeClass}">${item.status}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;">
            <button type="button" class="btn-table-action" data-view-ref="${item.ref}">View</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;

    // Attach listeners to View buttons
    tbody.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });
  }

  // ==========================================================
  // 9. TAB 2: SERVICES CATALOG & REQUEST TRACKER
  // ==========================================================

  function renderServicesCatalog() {
    const grid = document.getElementById('servicesCatalogGrid');
    if (!grid) return;

    let html = '';
    DEFAULT_SERVICES.forEach(function (s) {
      html += `
        <div class="service-card-apply">
          <div class="service-apply-header">
            <h4 class="service-apply-title">${s.name}</h4>
            <span class="service-fee-tag ${s.isFree ? 'free' : ''}">${s.fee}</span>
          </div>
          <p class="service-apply-desc">${s.desc}</p>
          <div class="service-apply-meta">
            <span class="service-turnaround">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${s.turnaround}</span>
            </span>
            <button type="button" class="btn-service-start" data-request-doc="${s.name}">Apply Now</button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    // Attach click to "Apply Now"
    grid.querySelectorAll('[data-request-doc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const docName = this.getAttribute('data-request-doc');
        openDocModalWithPreset(docName);
      });
    });
  }

  // ==========================================================
  // ACTION CONFIRMATION & DIALOG UTILITIES
  // ==========================================================

  function showActionConfirmModal({
    kicker = 'APPLICATION ACTION',
    title = 'Confirm Action',
    type = 'default',
    message = '',
    detailsHtml = '',
    confirmText = 'Confirm',
    cancelText = 'Go Back',
    isAlertOnly = false,
    onConfirm = null
  }) {
    if (!actionConfirmModal) return;

    if (confirmModalKicker) confirmModalKicker.textContent = kicker;
    if (confirmModalTitle) confirmModalTitle.textContent = title;
    if (confirmModalMessage) confirmModalMessage.innerHTML = message;

    if (confirmModalDetailsBox) {
      if (detailsHtml) {
        confirmModalDetailsBox.innerHTML = detailsHtml;
        confirmModalDetailsBox.style.display = 'block';
      } else {
        confirmModalDetailsBox.innerHTML = '';
        confirmModalDetailsBox.style.display = 'none';
      }
    }

    if (confirmModalIconBox) {
      if (type === 'delete') {
        confirmModalIconBox.innerHTML = `
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">Permanent Deletion</h4>
            <p style="margin: 0; font-size: 12.5px; color: #64748b;">This completed application will be permanently removed from your history.</p>
          </div>
        `;
      } else if (type === 'cancel') {
        confirmModalIconBox.innerHTML = `
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">Cancel Document Application</h4>
            <p style="margin: 0; font-size: 12.5px; color: #64748b;">Processing will be halted immediately.</p>
          </div>
        `;
      } else {
        confirmModalIconBox.innerHTML = `
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">Notice</h4>
            <p style="margin: 0; font-size: 12.5px; color: #64748b;">Barangay service processing rule</p>
          </div>
        `;
      }
    }

    if (btnExecuteConfirmAction) {
      btnExecuteConfirmAction.textContent = confirmText;
      btnExecuteConfirmAction.className = type === 'delete' ? 'btn-dash-danger' : (type === 'cancel' ? 'btn-dash-warning' : 'btn-dash-primary');
      if (isAlertOnly) {
        btnExecuteConfirmAction.style.display = 'none';
      } else {
        btnExecuteConfirmAction.style.display = 'inline-flex';
      }
    }

    if (btnCancelConfirmModal) {
      btnCancelConfirmModal.textContent = isAlertOnly ? 'Close' : cancelText;
    }

    pendingActionCallback = onConfirm;
    openModal(actionConfirmModal);
  }

  function handleCancelRequest(ref) {
    const req = userRequests.find(r => r.ref === ref);
    if (!req) return;

    if (req.status === 'Ready for Pickup') {
      showActionConfirmModal({
        kicker: 'CANCELLATION NOT ALLOWED',
        title: 'Document Already Ready for Pickup',
        type: 'warning',
        isAlertOnly: true,
        message: `Application <strong>${req.ref}</strong> for <strong>${req.docType}</strong> cannot be cancelled because it is already marked <strong>Ready for Pickup</strong> at Barangay Hall (Window 2). The official document has already been verified, printed, and dry-sealed. If you no longer need this certificate, please inform the staff at Window 2.`,
        detailsHtml: `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Reference No.:</span>
            <strong class="table-ref-code">${req.ref}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Document:</span>
            <strong>${req.docType}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Status:</span>
            <span class="status-pill status-ready">${req.status}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Claiming Mode:</span>
            <span>${req.claimMethod}</span>
          </div>
        `,
        cancelText: 'Understood'
      });
      return;
    }

    if (req.status === 'Completed') {
      showToast('Cannot Cancel', 'This request is already completed and claimed.', true);
      return;
    }

    if (req.status === 'Cancelled') {
      showToast('Already Cancelled', 'This application was already cancelled.', true);
      return;
    }

    // Eligible for cancellation (e.g. 'In Review', 'Pending')
    showActionConfirmModal({
      kicker: 'CANCEL APPLICATION REQUEST',
      title: 'Cancel Document Request?',
      type: 'cancel',
      message: `Are you sure you want to cancel your application for <strong>${req.docType}</strong>? This will stop further review and processing by barangay staff.`,
      detailsHtml: `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Reference No.:</span>
          <strong class="table-ref-code">${req.ref}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Document:</span>
          <strong>${req.docType}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Current Status:</span>
          <span class="status-pill ${getStatusBadgeClass(req.status)}">${req.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Date Submitted:</span>
          <span>${req.dateFiled}</span>
        </div>
      `,
      confirmText: 'Yes, Cancel Request',
      cancelText: 'Keep Request',
      onConfirm: function () {
        req.status = 'Cancelled';
        const todayStr = new Date().toISOString().split('T')[0];
        req.notes = (req.notes ? req.notes + ' ' : '') + `Cancelled by resident on ${todayStr}.`;
        saveData('brgy360_user_requests', userRequests);

        userNotifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'Request Cancelled',
          desc: `Application ${req.ref} for ${req.docType} has been cancelled.`,
          time: 'Just now',
          unread: true,
          type: 'amber'
        });
        saveData('brgy360_notifs', userNotifications);

        renderRequestsTable();
        renderDashboardKPIs();
        renderDashboardActivityTable();
        renderNotifications();
        showToast('Request Cancelled', `Application ${req.ref} has been cancelled.`);
      }
    });
  }

  function handleDeleteRequest(ref) {
    const req = userRequests.find(r => r.ref === ref);
    if (!req) return;

    if (req.status !== 'Completed') {
      showActionConfirmModal({
        kicker: 'DELETION NOT ALLOWED',
        title: 'Only Completed Applications Can Be Deleted',
        type: 'warning',
        isAlertOnly: true,
        message: `Application <strong>${req.ref}</strong> currently has status <strong>${req.status}</strong>. Per barangay auditing policy, applications can only be deleted from your history once they are marked <strong>Completed</strong>. Active, in-review, and ready-for-pickup requests must remain on record to track issuance.`,
        detailsHtml: `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Reference No.:</span>
            <strong class="table-ref-code">${req.ref}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Document:</span>
            <strong>${req.docType}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Current Status:</span>
            <span class="status-pill ${getStatusBadgeClass(req.status)}">${req.status}</span>
          </div>
        `,
        cancelText: 'Understood'
      });
      return;
    }

    // Eligible for deletion (status === 'Completed')
    showActionConfirmModal({
      kicker: 'PERMANENT DELETION',
      title: 'Delete Completed Application?',
      type: 'delete',
      message: `Are you sure you want to permanently remove completed application <strong>${req.ref}</strong> (<strong>${req.docType}</strong>) from your application history?`,
      detailsHtml: `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Reference No.:</span>
          <strong class="table-ref-code">${req.ref}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Document:</span>
          <strong>${req.docType}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Status:</span>
          <span class="status-pill status-completed">${req.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Date Claimed:</span>
          <span>${req.claimTarget || req.dateFiled}</span>
        </div>
      `,
      confirmText: 'Yes, Delete Record',
      cancelText: 'Keep Record',
      onConfirm: function () {
        userRequests = userRequests.filter(r => r.ref !== ref);
        saveData('brgy360_user_requests', userRequests);

        userNotifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'Record Deleted',
          desc: `Completed application record ${req.ref} (${req.docType}) was removed from your history.`,
          time: 'Just now',
          unread: false,
          type: 'blue'
        });
        saveData('brgy360_notifs', userNotifications);

        renderRequestsTable();
        renderDashboardKPIs();
        renderDashboardActivityTable();
        renderNotifications();
        showToast('Record Deleted', `Application ${req.ref} has been removed from your history.`);
      }
    });
  }

  function renderRequestsTable() {
    const tbody = document.getElementById('servicesRequestsTableBody');
    if (!tbody) return;

    const searchVal = (document.getElementById('requestsSearchInput')?.value || '').toLowerCase().trim();
    const activeFilterBtn = document.querySelector('#requestsFilterPills .filter-pill-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'All';

    // Update filter counts
    const countAll = userRequests.length;
    const countReady = userRequests.filter(r => r.status === 'Ready for Pickup').length;
    const countReview = userRequests.filter(r => r.status === 'In Review').length;
    const countDone = userRequests.filter(r => r.status === 'Completed').length;
    const countCancel = userRequests.filter(r => r.status === 'Cancelled').length;

    const countAllEl = document.getElementById('countAllReq');
    const countReadyEl = document.getElementById('countReadyReq');
    const countReviewEl = document.getElementById('countReviewReq');
    const countDoneEl = document.getElementById('countDoneReq');
    const countCancelEl = document.getElementById('countCancelReq');
    if (countAllEl) countAllEl.textContent = countAll;
    if (countReadyEl) countReadyEl.textContent = countReady;
    if (countReviewEl) countReviewEl.textContent = countReview;
    if (countDoneEl) countDoneEl.textContent = countDone;
    if (countCancelEl) countCancelEl.textContent = countCancel;

    // Filter requests
    const filtered = userRequests.filter(function (r) {
      const matchFilter = filter === 'All' || r.status === filter;
      const matchSearch = !searchVal || 
        r.ref.toLowerCase().includes(searchVal) ||
        r.docType.toLowerCase().includes(searchVal) ||
        r.purpose.toLowerCase().includes(searchVal) ||
        r.status.toLowerCase().includes(searchVal);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 32px;">No requests found matching your filter criteria.</td></tr>';
      return;
    }

    let rowsHtml = '';
    filtered.forEach(function (r) {
      const badgeClass = getStatusBadgeClass(r.status);
      const isPickup = r.status === 'Ready for Pickup';
      const isCompleted = r.status === 'Completed';
      const isCancelled = r.status === 'Cancelled';
      const canCancel = !isPickup && !isCompleted && !isCancelled;
      const canDelete = isCompleted;

      // Cancel button rendering
      let cancelBtnHtml = '';
      if (canCancel) {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel" data-cancel-ref="${r.ref}" title="Cancel this application">Cancel</button>`;
      } else if (isPickup) {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel disabled" data-cancel-ref="${r.ref}" title="Cannot be cancelled: document is already ready for pickup at Barangay Hall">Cancel</button>`;
      } else if (isCancelled) {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel disabled" data-cancel-ref="${r.ref}" title="This request has already been cancelled" disabled>Cancelled</button>`;
      } else {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel disabled" data-cancel-ref="${r.ref}" title="Completed request cannot be cancelled" disabled>Cancel</button>`;
      }

      // Delete button rendering
      let deleteBtnHtml = '';
      if (canDelete) {
        deleteBtnHtml = `<button type="button" class="btn-table-action btn-table-delete" data-delete-ref="${r.ref}" title="Delete completed application from history">Delete</button>`;
      } else {
        deleteBtnHtml = `<button type="button" class="btn-table-action btn-table-delete disabled" data-delete-ref="${r.ref}" title="Can only be deleted once marked Completed (current status: ${r.status})">Delete</button>`;
      }

      rowsHtml += `
        <tr>
          <td style="vertical-align: middle;"><span class="table-ref-code">${r.ref}</span></td>
          <td style="vertical-align: middle;"><strong>${r.docType}</strong></td>
          <td style="vertical-align: middle;"><span style="font-size: 12.5px; color: #475569;">${r.purpose}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;">${r.dateFiled}</td>
          <td style="vertical-align: middle;"><span style="font-size: 12px; color: #334155;">${r.claimMethod}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;"><span class="status-pill ${badgeClass}">${r.status}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;">
            <div class="table-actions-group">
              <button type="button" class="btn-table-action" data-view-ref="${r.ref}" title="View Details">Details</button>
              ${cancelBtnHtml}
              ${deleteBtnHtml}
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;

    tbody.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });

    tbody.querySelectorAll('[data-cancel-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-cancel-ref');
        handleCancelRequest(ref);
      });
    });

    tbody.querySelectorAll('[data-delete-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-delete-ref');
        handleDeleteRequest(ref);
      });
    });
  }

  // Filter pills events for requests
  const reqFilterPills = document.querySelectorAll('#requestsFilterPills .filter-pill-btn');
  reqFilterPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      reqFilterPills.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderRequestsTable();
    });
  });

  const requestsSearchInput = document.getElementById('requestsSearchInput');
  if (requestsSearchInput) {
    requestsSearchInput.addEventListener('input', renderRequestsTable);
  }

  // ==========================================================
  // 10. TAB 3: CONCERNS FEED & TRACKER
  // ==========================================================

  function renderConcernsFeed() {
    const container = document.getElementById('concernsFeedContainer');
    if (!container) return;

    const searchVal = (document.getElementById('concernsSearchInput')?.value || '').toLowerCase().trim();
    const activeFilterBtn = document.querySelector('#concernsFilterPills .filter-pill-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'All';

    // Update counts
    const countAll = userConcerns.length;
    const countNew = userConcerns.filter(c => c.status === 'New').length;
    const countReview = userConcerns.filter(c => c.status === 'In Review').length;
    const countResolved = userConcerns.filter(c => c.status === 'Resolved').length;

    const countAllEl = document.getElementById('countAllConcerns');
    const countNewEl = document.getElementById('countNewConcerns');
    const countReviewEl = document.getElementById('countReviewConcerns');
    const countResolvedEl = document.getElementById('countResolvedConcerns');
    if (countAllEl) countAllEl.textContent = countAll;
    if (countNewEl) countNewEl.textContent = countNew;
    if (countReviewEl) countReviewEl.textContent = countReview;
    if (countResolvedEl) countResolvedEl.textContent = countResolved;

    const filtered = userConcerns.filter(function (c) {
      const matchFilter = filter === 'All' || c.status === filter;
      const matchSearch = !searchVal ||
        c.ref.toLowerCase().includes(searchVal) ||
        c.category.toLowerCase().includes(searchVal) ||
        c.desc.toLowerCase().includes(searchVal) ||
        c.location.toLowerCase().includes(searchVal);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border);">No concerns reported under this category.</div>';
      return;
    }

    let cardsHtml = '';
    filtered.forEach(function (c) {
      const isUrgent = c.urgency === 'Urgent';
      const stage = c.currentStage || (c.status === 'Resolved' ? 3 : (c.status === 'In Review' ? 2 : 1));

      cardsHtml += `
        <div class="concern-item-card">
          <div class="concern-item-header">
            <div class="concern-ref-wrap">
              <span class="concern-ticket-id">${c.ref}</span>
              <span class="concern-cat-tag">${c.category}</span>
              ${isUrgent ? '<span class="status-pill status-urgent">Urgent Hazard</span>' : ''}
              <span class="concern-date">Filed on ${c.dateFiled}</span>
            </div>
            <button type="button" class="btn-table-action" data-view-ref="${c.ref}">View Record</button>
          </div>

          <div class="concern-location-row">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${c.location}</span>
          </div>

          <p class="concern-desc-text">${c.desc}</p>

          <!-- 3-Step Visual Progress Stepper -->
          <div class="concern-progress-stepper">
            <div class="stepper-stage ${stage >= 1 ? (stage === 1 ? 'active' : 'completed') : ''}">
              <div class="stage-bullet">${stage > 1 ? '✓' : '1'}</div>
              <span>New / Logged</span>
            </div>
            <div class="stepper-line ${stage >= 2 ? 'filled' : ''}"></div>
            <div class="stepper-stage ${stage >= 2 ? (stage === 2 ? 'active' : 'completed') : ''}">
              <div class="stage-bullet">${stage > 2 ? '✓' : '2'}</div>
              <span>In Review / Inspected</span>
            </div>
            <div class="stepper-line ${stage >= 3 ? 'filled' : ''}"></div>
            <div class="stepper-stage ${stage >= 3 ? 'completed' : ''}">
              <div class="stage-bullet">${stage === 3 ? '✓' : '3'}</div>
              <span>Resolved</span>
            </div>
          </div>

          ${c.resolutionNote ? `
            <div class="concern-resolution-box">
              <div class="resolution-header">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Barangay Personnel Action &amp; Resolution Notes:</span>
              </div>
              <p class="resolution-text">${c.resolutionNote}</p>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = cardsHtml;

    container.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });
  }

  const concernFilterPills = document.querySelectorAll('#concernsFilterPills .filter-pill-btn');
  concernFilterPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      concernFilterPills.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderConcernsFeed();
    });
  });

  const concernsSearchInput = document.getElementById('concernsSearchInput');
  if (concernsSearchInput) {
    concernsSearchInput.addEventListener('input', renderConcernsFeed);
  }

  // ==========================================================
  // 11. TAB 4: PROJECT PROPOSALS FEED
  // ==========================================================

  function renderProposalsFeed() {
    const container = document.getElementById('proposalsFeedContainer');
    if (!container) return;

    if (userProposals.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border);">No proposals submitted yet. Click "Submit Proposal" above to pitch an initiative.</div>';
      return;
    }

    let html = '';
    userProposals.forEach(function (p) {
      html += `
        <div class="proposal-item-card">
          <div class="proposal-item-top">
            <div>
              <h4 class="proposal-title">${p.title}</h4>
              <div class="proposal-meta-tags">
                <span class="proposal-id-tag">${p.ref}</span>
                <span class="proposal-cat-tag">${p.category}</span>
                <span class="proposal-budget-tag">₱${Number(p.budget).toLocaleString()}</span>
                <span class="status-pill status-pending">${p.status}</span>
                <span style="font-size: 11.5px; color: #94a3b8;">Submitted ${p.dateFiled}</span>
              </div>
            </div>
            <button type="button" class="btn-table-action" data-view-ref="${p.ref}">Full Proposal</button>
          </div>

          <div style="font-size: 12.5px; color: #475569; margin-bottom: 8px;">
            <strong>Target Location:</strong> ${p.location} ${p.timeline ? `&bull; <strong>Timeline:</strong> ${p.timeline}` : ''}
          </div>

          <p class="proposal-rationale">${p.rationale}</p>

          ${p.councilNote ? `
            <div class="proposal-council-note">
              <div class="council-note-title">Barangay Development Council (BDC) Review Note:</div>
              <p class="council-note-text">${p.councilNote}</p>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });
  }

  // ==========================================================
  // 12. MODAL CONTROLS & SUBMISSION HANDLERS
  // ==========================================================

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // File picker labels
  if (modalDocAttachment && modalDocAttachmentName) {
    modalDocAttachment.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        modalDocAttachmentName.textContent = 'Attached: ' + this.files[0].name;
      }
    });
  }
  if (modalConcernPhoto && modalConcernPhotoName) {
    modalConcernPhoto.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        modalConcernPhotoName.textContent = 'Attached: ' + this.files[0].name;
      }
    });
  }
  if (newIdFile && newIdFileName) {
    newIdFile.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        newIdFileName.textContent = 'Selected: ' + this.files[0].name;
      }
    });
  }

  // A. Document Request Modal
  function openDocModalWithPreset(docName) {
    if (modalDocType && docName) {
      modalDocType.value = docName;
    }
    syncUserDisplays();
    openModal(docRequestModal);
  }

  if (btnOpenNewDocModal) {
    btnOpenNewDocModal.addEventListener('click', () => openDocModalWithPreset('Barangay Clearance'));
  }
  if (btnDashNewRequest) {
    btnDashNewRequest.addEventListener('click', () => openDocModalWithPreset('Barangay Clearance'));
  }
  if (scRequestDoc) {
    scRequestDoc.addEventListener('click', () => openDocModalWithPreset('Barangay Clearance'));
  }
  if (closeDocModalBtn) closeDocModalBtn.addEventListener('click', () => closeModal(docRequestModal));
  if (btnCancelDocModal) btnCancelDocModal.addEventListener('click', () => closeModal(docRequestModal));

  if (docApplicationForm) {
    docApplicationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const docType = modalDocType ? modalDocType.value : 'Barangay Clearance';
      const cat = document.getElementById('modalDocPurposeCategory')?.value || 'General';
      const specific = document.getElementById('modalDocPurposeSpecific')?.value || '';
      const claimMethod = 'Physical Pickup at Barangay Hall';

      // Generate Reference Code
      const refCode = 'BRGY-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toISOString().split('T')[0];

      const newRequest = {
        ref: refCode,
        docType: docType,
        purpose: cat + (specific ? ` (${specific})` : ''),
        dateFiled: today,
        claimMethod: claimMethod,
        claimTarget: 'Estimated within 1–2 business days',
        status: 'In Review',
        notes: 'Application received online. Document being prepared for validation by Barangay Secretary.'
      };

      userRequests.unshift(newRequest);
      saveData('brgy360_requests', userRequests);

      // Add notification
      userNotifications.unshift({
        id: Date.now(),
        title: 'New Document Request Filed',
        desc: `Application for ${docType} has been submitted. Reference: ${refCode}.`,
        time: 'Just now',
        unread: true,
        type: 'blue'
      });
      saveData('brgy360_notifs', userNotifications);

      // Refresh UI
      renderDashboardKPIs();
      renderDashboardActivityTable();
      renderRequestsTable();
      renderNotifications();

      closeModal(docRequestModal);
      docApplicationForm.reset();

      showToast('Application Submitted!', `Reference: ${refCode}. You will receive status updates.`);
      switchTab('services');
    });
  }

  // B. Concern Modal
  if (btnOpenNewConcernModal) {
    btnOpenNewConcernModal.addEventListener('click', () => openModal(concernModal));
  }
  if (btnDashNewConcern) {
    btnDashNewConcern.addEventListener('click', () => openModal(concernModal));
  }
  if (scFileConcern) {
    scFileConcern.addEventListener('click', () => openModal(concernModal));
  }
  if (closeConcernModalBtn) closeConcernModalBtn.addEventListener('click', () => closeModal(concernModal));
  if (btnCancelConcernModal) btnCancelConcernModal.addEventListener('click', () => closeModal(concernModal));

  if (concernReportForm) {
    concernReportForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const category = document.getElementById('modalConcernCategory')?.value || 'Infrastructure';
      const urgency = document.getElementById('modalConcernUrgency')?.value || 'Standard';
      const sitio = document.getElementById('modalConcernSitio')?.value || '';
      const landmark = document.getElementById('modalConcernLocation')?.value || '';
      const location = sitio ? (landmark ? `${sitio} — ${landmark}` : sitio) : landmark;
      const desc = document.getElementById('modalConcernDesc')?.value || '';

      const ticketRef = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
      const today = new Date().toISOString().split('T')[0];

      const newConcern = {
        ref: ticketRef,
        category: category,
        urgency: urgency,
        location: location,
        dateFiled: today,
        status: 'New',
        currentStage: 1,
        desc: desc,
        resolutionNote: 'Ticket received and queued for assignment to the concerned committee / BPSO inspection unit.'
      };

      userConcerns.unshift(newConcern);
      saveData('brgy360_concerns', userConcerns);

      userNotifications.unshift({
        id: Date.now(),
        title: 'Concern Ticket Issued',
        desc: `Ticket ${ticketRef} has been logged for "${category}" at ${location}.`,
        time: 'Just now',
        unread: true,
        type: 'amber'
      });
      saveData('brgy360_notifs', userNotifications);

      renderDashboardKPIs();
      renderDashboardActivityTable();
      renderConcernsFeed();
      renderNotifications();

      closeModal(concernModal);
      concernReportForm.reset();

      showToast('Concern Reported!', `Ticket #${ticketRef} issued. Barangay team alerted.`);
      switchTab('reports');
    });
  }

  // C. Proposal Modal
  if (btnOpenNewProposalModal) {
    btnOpenNewProposalModal.addEventListener('click', () => openModal(proposalModal));
  }
  if (scProposeProj) {
    scProposeProj.addEventListener('click', () => openModal(proposalModal));
  }
  if (closeProposalModalBtn) closeProposalModalBtn.addEventListener('click', () => closeModal(proposalModal));
  if (btnCancelPropModal) btnCancelPropModal.addEventListener('click', () => closeModal(proposalModal));

  if (proposalSubmitForm) {
    proposalSubmitForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.getElementById('modalPropTitle')?.value || '';
      const category = document.getElementById('modalPropCategory')?.value || 'Infrastructure';
      const location = document.getElementById('modalPropLocation')?.value || '';
      const budget = parseFloat(document.getElementById('modalPropBudget')?.value || 0);
      const timeline = document.getElementById('modalPropTimeline')?.value || '';
      const rationale = document.getElementById('modalPropRationale')?.value || '';

      const propRef = 'PROP-' + Math.floor(1000 + Math.random() * 9000);
      const today = new Date().toISOString().split('T')[0];

      const newProposal = {
        ref: propRef,
        title: title,
        category: category,
        location: location,
        budget: budget,
        timeline: timeline,
        dateFiled: today,
        status: 'Under BDC Review',
        rationale: rationale,
        councilNote: 'Received by Barangay Development Council Secretariat. Queued for technical feasibility review.'
      };

      userProposals.unshift(newProposal);
      saveData('brgy360_proposals', userProposals);

      userNotifications.unshift({
        id: Date.now(),
        title: 'Project Proposal Received',
        desc: `Proposal "${title}" (${propRef}) submitted to the Development Council.`,
        time: 'Just now',
        unread: true,
        type: 'green'
      });
      saveData('brgy360_notifs', userNotifications);

      renderDashboardKPIs();
      renderDashboardActivityTable();
      renderProposalsFeed();
      renderNotifications();

      closeModal(proposalModal);
      proposalSubmitForm.reset();

      showToast('Proposal Submitted!', `Reference ID: ${propRef}. Thank you for your civic initiative!`);
      switchTab('proposals');
    });
  }

  // D. Detail Viewer Modal
  function openDetailViewer(refCode) {
    if (!detailViewerModal || !detailModalBody) return;

    let item = userRequests.find(r => r.ref === refCode);
    let itemType = 'request';

    if (!item) {
      item = userConcerns.find(c => c.ref === refCode);
      itemType = 'concern';
    }
    if (!item) {
      item = userProposals.find(p => p.ref === refCode);
      itemType = 'proposal';
    }

    if (!item) return;

    if (itemType === 'request') {
      const isPickup = item.status === 'Ready for Pickup';
      if (detailModalKicker) detailModalKicker.textContent = 'SERVICE APPLICATION SLIP';
      if (detailModalTitle) detailModalTitle.textContent = item.docType;

      detailModalBody.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Official Reference Code</span>
            <span class="table-ref-code" style="font-size: 14px;">${item.ref}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12.5px; color: #475569;">Application Status:</span>
            <span class="status-pill ${getStatusBadgeClass(item.status)}">${item.status}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Applicant Name:</span>
            <strong>${currentUser.name}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Purpose of Application:</span>
            <span>${item.purpose}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Date Submitted:</span>
            <span>${item.dateFiled}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Claiming Mode:</span>
            <span>${item.claimMethod}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Target Release:</span>
            <strong>${item.claimTarget || '1-2 Working Days'}</strong>
          </div>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; font-size: 12.5px; color: #14532d;">
          <strong>Official Processing Note:</strong>
          <p style="margin: 4px 0 0 0; line-height: 1.45;">${item.notes || 'Document verified and logged in the Barangay Database.'}</p>
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          ${!isPickup && item.status !== 'Completed' && item.status !== 'Cancelled' ? `
            <button type="button" class="btn-table-action btn-table-cancel" id="btnModalCancelReq" data-modal-cancel="${item.ref}">Cancel Request</button>
          ` : ''}
          ${isPickup ? `
            <button type="button" class="btn-table-action btn-table-cancel disabled" id="btnModalCancelReq" data-modal-cancel="${item.ref}" title="Cannot be cancelled: document is already ready for pickup at Barangay Hall">Cancel (Locked for Pickup)</button>
          ` : ''}
          ${item.status === 'Completed' ? `
            <button type="button" class="btn-table-action btn-table-delete" id="btnModalDeleteReq" data-modal-delete="${item.ref}">Delete Record</button>
          ` : `
            <button type="button" class="btn-table-action btn-table-delete disabled" id="btnModalDeleteReq" data-modal-delete="${item.ref}" title="Can only be deleted once Completed">Delete (Completed Only)</button>
          `}
        </div>
      `;

      setTimeout(() => {
        const modalCancelBtn = document.getElementById('btnModalCancelReq');
        if (modalCancelBtn) {
          modalCancelBtn.addEventListener('click', function () {
            const refToCancel = this.getAttribute('data-modal-cancel');
            closeModal(detailViewerModal);
            handleCancelRequest(refToCancel);
          });
        }
        const modalDeleteBtn = document.getElementById('btnModalDeleteReq');
        if (modalDeleteBtn) {
          modalDeleteBtn.addEventListener('click', function () {
            const refToDelete = this.getAttribute('data-modal-delete');
            closeModal(detailViewerModal);
            handleDeleteRequest(refToDelete);
          });
        }
      }, 0);
    } else if (itemType === 'concern') {
      if (detailModalKicker) detailModalKicker.textContent = 'CITIZEN CONCERN TICKET';
      if (detailModalTitle) detailModalTitle.textContent = item.category + ' Issue';

      detailModalBody.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Ticket Number</span>
            <span class="table-ref-code" style="font-size: 14px;">${item.ref}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12.5px; color: #475569;">Resolution Progress:</span>
            <span class="status-pill ${getStatusBadgeClass(item.status)}">${item.status}</span>
          </div>
        </div>

        <div style="font-size: 13px; margin-bottom: 16px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Incident Location:</strong>
          <p style="color: #475569; margin: 0 0 12px 0;">${item.location}</p>
          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Resident's Description:</strong>
          <p style="color: #475569; margin: 0; line-height: 1.5;">${item.desc}</p>
        </div>

        ${item.resolutionNote ? `
          <div class="concern-resolution-box">
            <div class="resolution-header">Barangay Official Response:</div>
            <p class="resolution-text">${item.resolutionNote}</p>
          </div>
        ` : ''}
      `;
    } else {
      if (detailModalKicker) detailModalKicker.textContent = 'DEVELOPMENT PROPOSAL';
      if (detailModalTitle) detailModalTitle.textContent = item.title;

      detailModalBody.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Proposal ID</span>
            <span class="table-ref-code" style="font-size: 14px;">${item.ref}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12.5px; color: #475569;">Council Status:</span>
            <span class="status-pill status-pending">${item.status}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; margin-bottom: 16px;">
          <div><strong style="color: #64748b;">Sector:</strong> ${item.category}</div>
          <div><strong style="color: #64748b;">Target Location:</strong> ${item.location}</div>
          <div><strong style="color: #64748b;">Estimated Budget:</strong> ₱${Number(item.budget).toLocaleString()}</div>
          <div><strong style="color: #64748b;">Proposed Timeline:</strong> ${item.timeline || 'Not specified'}</div>
        </div>

        <div style="font-size: 13px; margin-bottom: 16px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Rationale & Community Impact:</strong>
          <p style="color: #475569; margin: 0; line-height: 1.55;">${item.rationale}</p>
        </div>

        ${item.councilNote ? `
          <div class="proposal-council-note">
            <div class="council-note-title">Barangay Development Council Evaluation:</div>
            <p class="council-note-text">${item.councilNote}</p>
          </div>
        ` : ''}
      `;
    }

    openModal(detailViewerModal);
  }

  if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', () => closeModal(detailViewerModal));

  // Action Confirmation Modal event handlers
  if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener('click', () => closeModal(actionConfirmModal));
  if (btnCancelConfirmModal) btnCancelConfirmModal.addEventListener('click', () => closeModal(actionConfirmModal));
  if (btnExecuteConfirmAction) {
    btnExecuteConfirmAction.addEventListener('click', function () {
      if (typeof pendingActionCallback === 'function') {
        const cb = pendingActionCallback;
        pendingActionCallback = null;
        closeModal(actionConfirmModal);
        cb();
      } else {
        closeModal(actionConfirmModal);
      }
    });
  }

  // Close modals on clicking overlay backdrop
  [docRequestModal, concernModal, proposalModal, detailViewerModal, actionConfirmModal].forEach(function (modal) {
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal(docRequestModal);
      closeModal(concernModal);
      closeModal(proposalModal);
      closeModal(detailViewerModal);
      closeModal(actionConfirmModal);
      if (notifDropdown) notifDropdown.classList.remove('active');
      if (profileDropdown) profileDropdown.classList.remove('active');
    }
  });

  // ==========================================================
  // 13. ACCOUNT TAB: FORMS HANDLING
  // ==========================================================

  // A. Contact info form
  if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const mobile = document.getElementById('profileMobile')?.value.trim();
      const email = document.getElementById('profileEmail')?.value.trim();
      const address = document.getElementById('profileAddress')?.value.trim();
      const sitio = document.getElementById('profileSitio')?.value;

      currentUser.mobile = mobile || currentUser.mobile;
      currentUser.email = email || currentUser.email;
      currentUser.address = address || currentUser.address;
      currentUser.sitio = sitio || currentUser.sitio;

      saveData('brgy360_user', currentUser);
      syncUserDisplays();
      showToast('Profile Updated', 'Contact information saved successfully.');
    });
  }

  // B. Change Password Form
  if (changePasswordForm) {
    const curInput = document.getElementById('currentPassword');
    const newPwdInput = document.getElementById('newPassword');
    const confirmPwdInput = document.getElementById('confirmNewPassword');
    const curErr = document.getElementById('currentPasswordError');
    const newPwdErr = document.getElementById('newPasswordError');
    const confirmPwdErr = document.getElementById('confirmNewPasswordError');
    const bannerErr = document.getElementById('passwordErrorMsg');

    function setFieldError(inputEl, errorEl, message) {
      if (inputEl) inputEl.classList.add('input-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    }

    function clearFieldError(inputEl, errorEl) {
      if (inputEl) inputEl.classList.remove('input-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    function clearAllPasswordErrors() {
      clearFieldError(curInput, curErr);
      clearFieldError(newPwdInput, newPwdErr);
      clearFieldError(confirmPwdInput, confirmPwdErr);
      if (bannerErr) {
        bannerErr.textContent = '';
        bannerErr.style.display = 'none';
      }
    }

    // Dynamic error clearing as user types
    if (curInput) {
      curInput.addEventListener('input', function () {
        if (curInput.value.trim()) {
          clearFieldError(curInput, curErr);
        }
      });
    }

    if (newPwdInput) {
      newPwdInput.addEventListener('input', function () {
        const val = newPwdInput.value;
        if (val.length >= 8 && /[a-zA-Z]/.test(val) && /[0-9]/.test(val)) {
          clearFieldError(newPwdInput, newPwdErr);
        }
        if (confirmPwdInput && confirmPwdInput.value && confirmPwdInput.value === val) {
          clearFieldError(confirmPwdInput, confirmPwdErr);
        }
      });
    }

    if (confirmPwdInput) {
      confirmPwdInput.addEventListener('input', function () {
        if (confirmPwdInput.value && confirmPwdInput.value === (newPwdInput ? newPwdInput.value : '')) {
          clearFieldError(confirmPwdInput, confirmPwdErr);
        }
      });
    }

    changePasswordForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllPasswordErrors();

      const cur = (curInput?.value || '').trim();
      const p1 = newPwdInput?.value || '';
      const p2 = confirmPwdInput?.value || '';

      let hasError = false;
      let firstInvalidInput = null;

      // 1. Verify that Current Password is entered
      if (!cur) {
        setFieldError(curInput, curErr, 'Please enter your current password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = curInput;
      }

      // 2. Verify that New Password meets security requirements
      if (!p1) {
        setFieldError(newPwdInput, newPwdErr, 'Please enter a new password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      } else if (p1.length < 8) {
        setFieldError(newPwdInput, newPwdErr, 'New password must be at least 8 characters long.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      } else if (!/[a-zA-Z]/.test(p1) || !/[0-9]/.test(p1)) {
        setFieldError(newPwdInput, newPwdErr, 'New password must contain both letters and numbers.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      }

      // 3. Verify that Confirm New Password matches
      if (!p2) {
        setFieldError(confirmPwdInput, confirmPwdErr, 'Please confirm your new password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = confirmPwdInput;
      } else if (p1 !== p2) {
        setFieldError(confirmPwdInput, confirmPwdErr, 'Passwords do not match. Please re-enter.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = confirmPwdInput;
      }

      if (hasError) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      changePasswordForm.reset();
      clearAllPasswordErrors();
      changePasswordForm.querySelectorAll('.password-toggle-btn').forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const input = targetId ? document.getElementById(targetId) : null;
        if (input && input.type === 'text') {
          input.type = 'password';
          const showIcon = btn.querySelector('.eye-show');
          const hideIcon = btn.querySelector('.eye-hide');
          if (showIcon) showIcon.style.display = 'block';
          if (hideIcon) hideIcon.style.display = 'none';
          btn.setAttribute('aria-label', 'Show password');
          btn.setAttribute('title', 'Show password');
        }
      });
      showToast('Password Updated', 'Your account credentials have been changed successfully.');
    });
  }

  // C. ID Re-Verification Form
  if (idUploadForm) {
    idUploadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const idType = document.getElementById('newIdType')?.value || 'Cedula';
      const fileInput = document.getElementById('newIdFile');

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('Document Required', 'Please select a photo or scan of your document.', true);
        return;
      }

      idUploadForm.reset();
      if (newIdFileName) newIdFileName.textContent = 'Click to select photo or scan (PNG, JPG, PDF)';

      showToast('ID Uploaded for Verification', `Your ${idType} has been submitted for secretary validation.`);
    });
  }

  // ==========================================================
  // 14. LOGOUT SESSION MANAGEMENT
  // ==========================================================

  function handleLogout() {
    localStorage.removeItem('brgy360_session');
    localStorage.removeItem('currentUserRole');
    showToast('Signed Out', 'Redirecting to public portal...');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 600);
  }

  if (topbarLogoutBtn) topbarLogoutBtn.addEventListener('click', handleLogout);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);

  // ==========================================================
  // 15. INITIAL RENDER CALLS
  // ==========================================================

  syncUserDisplays();
  updateDateBanner();
  renderNotifications();
  renderDashboardKPIs();
  renderDashboardActivityTable();
  renderServicesCatalog();
  renderRequestsTable();
  renderConcernsFeed();
  renderProposalsFeed();
  handleInitialHash();

});
