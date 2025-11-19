/**
 * Profile Page - Vanilla JavaScript Implementation
 * Matches the Figma design with a clean, simple interface
 */

// Mock data structure
const profileData = {
  stats: {
    posts: 3,
    likes: 12,
    score: 8, // Agora Sparks
  },
  tabs: [
    { id: 'messages', label: 'Messages', active: true },
    { id: 'notifications', label: 'Notification', active: false },
  ],
  barItems: [
    { id: 'my-posts', label: 'My posts', action: 'navigate', url: '/posts' },
    { id: 'my-comments', label: 'My comments', action: 'navigate', url: '/comments' },
    { id: 'agora-sparks', label: 'Agora Sparks', action: 'navigate', url: '/sparks' },
    { id: 'netid-verification', label: 'NetID Verification', action: 'navigate', url: '/email-verify/' },
  ],
};

/**
 * Initialize the profile page
 */
function initProfile() {
  const root = document.getElementById('root');
  // Safer DOM construction: avoid innerHTML to prevent accidental XSS when
  // profileData is later populated from untrusted sources. Build DOM nodes
  // with textContent and element creation so user-provided text never .innerHTML.
  const el = renderProfile();
  root.appendChild(el);
  attachEventListeners();
}

/**
 * Render the complete profile UI
 */
function renderProfile() {
  // Create the top-level container
  const container = document.createElement('div');
  container.className = 'profile-container';

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  container.appendChild(avatar);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'stats';
  ['Posts', 'Likes', 'Agora Sparks'].forEach((label, idx) => {
    const item = document.createElement('div');
    item.className = 'stats-item';
    item.appendChild(document.createTextNode(label));

    const strong = document.createElement('strong');
    // Allow only numbers here (they are safe by nature); cast to Number
    let value = 0;
    if (idx === 0) value = Number(profileData.stats.posts || 0);
    if (idx === 1) value = Number(profileData.stats.likes || 0);
    if (idx === 2) value = Number(profileData.stats.score || 0);
    strong.textContent = String(value);
    item.appendChild(strong);
    stats.appendChild(item);
  });
  container.appendChild(stats);

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'tabs';
  profileData.tabs.forEach((tab) => {
    const t = document.createElement('div');
    t.className = 'tab';
    if (tab.active) t.classList.add('active');
    t.dataset.tabId = tab.id;
    t.textContent = tab.label;
    tabs.appendChild(t);
  });
  container.appendChild(tabs);

  // Bar list
  const barList = document.createElement('div');
  barList.className = 'bar-list';
  profileData.barItems.forEach((item) => {
    if (item.action === 'link') {
      const a = document.createElement('a');
      a.className = 'bar';
      // URL should be treated as untrusted — use encodeURI on user-provided parts
      a.href = typeof item.url === 'string' ? encodeURI(item.url) : '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.label;
      barList.appendChild(a);
    } else {
      const b = document.createElement('div');
      b.className = 'bar';
      if (item.id) b.dataset.barId = item.id;
      b.textContent = item.label;
      barList.appendChild(b);
    }
  });
  container.appendChild(barList);

  return container;
}

/**
 * Attach event listeners to interactive elements
 */
function attachEventListeners() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', handleTabClick);
  });

  // Bar item clicks
  const bars = document.querySelectorAll('.bar[data-bar-id]');
  bars.forEach((bar) => {
    bar.addEventListener('click', handleBarClick);
  });
}

/**
 * Handle tab click events
 */
function handleTabClick(event) {
  const clickedTab = event.currentTarget;
  const tabId = clickedTab.dataset.tabId;

  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.remove('active');
  });

  // Add active class to clicked tab
  clickedTab.classList.add('active');

  // Update data
  profileData.tabs.forEach((tab) => {
    tab.active = tab.id === tabId;
  });

  console.log(`Switched to tab: ${tabId}`);
}

/**
 * Handle bar item click events
 */
function handleBarClick(event) {
  const barId = event.currentTarget.dataset.barId;
  const barItem = profileData.barItems.find((item) => item.id === barId);

  if (barItem) {
    console.log(`Clicked bar: ${barItem.label} (${barId})`);
    navigateTo(barItem.url || `/${barId}`);
  }
}

/**
 * Helper function for navigation
 */
function navigateTo(path) {
  console.log(`Navigating to: ${path}`);
  // In a real app, use window.location.href or a router
  // window.location.href = path;
  alert(`Navigation to ${path} would happen here`);
}

/**
 * Fetch real profile data from API
 */
async function fetchProfileData() {
  try {
    const response = await fetch('/api/profile/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Update profile data with real data
      Object.assign(profileData, data);
      console.log('Profile data updated:', profileData);
    } else {
      console.warn('Failed to fetch profile data, using mock data');
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    // Continue with mock data if API fails
  }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  initProfile();
  // Optionally fetch real data from API
  // await fetchProfileData();
});
