// Canonical page list + page-type map. Single source of truth for the harness.
const PAGES = [
  ['index.html', 'home'],
  ['projects.html', 'listing'],
  ['resources.html', 'listing'],
  ['tools.html', 'tool'],
  ['interview-prep.html', 'listing'],
  ['about.html', 'static'],
  ['contact.html', 'static'],
  ['privacy.html', 'static'],
  ['404.html', 'static'],
  ['project-static-website.html', 'project'],
  ['project-serverless-contact-form.html', 'project'],
  ['project-ec2-web-server.html', 'project'],
  ['project-three-tier-web-app.html', 'project'],
  ['project-cicd-pipeline.html', 'project'],
  ['project-serverless-rest-api.html', 'project'],
  ['project-infrastructure-as-code.html', 'project'],
  ['project-multi-region-active-active.html', 'project'],
  ['project-kubernetes-eks.html', 'project'],
  ['project-realtime-data-pipeline.html', 'project'],
  ['project-multi-account-landing-zone.html', 'project'],
];
// admin.html is auth-gated in production and not part of the public site; it is
// snapshotted for integrity but excluded from Lighthouse/axe budgets.
const EXTRA = [['admin.html', 'admin']];
// One representative per page type for the expensive runs (Lighthouse).
const REPRESENTATIVE = ['index.html', 'projects.html', 'tools.html', 'interview-prep.html', 'about.html', 'project-multi-account-landing-zone.html', 'resources.html'];
const WIDTHS = [390, 768, 1440];
// Hosts that must never be contacted from automation (ads, analytics, consent).
const BLOCKED_HOST_RE = /(^|\.)(googlesyndication\.com|doubleclick\.net|googleadservices\.com|google-analytics\.com|analytics\.google\.com|googletagmanager\.com|googletagservices\.com|fundingchoicesmessages\.google\.com|adtrafficquality\.google|google\.com|gstatic\.com|amazon-adsystem\.com)$/i;
module.exports = { PAGES, EXTRA, REPRESENTATIVE, WIDTHS, BLOCKED_HOST_RE };
