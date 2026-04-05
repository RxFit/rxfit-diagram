/**
 * Google Sheets Data Source Registry
 *
 * Add new living documents here. The system will poll each enabled
 * source on its configured interval and merge tasks into the
 * Command Center automatically.
 *
 * SETUP GUIDE (3 minutes):
 * 1. Open the Google Sheet → Extensions → Apps Script
 * 2. Paste the doGet() function from APPS_SCRIPT_TEMPLATE below
 * 3. Deploy → New Deployment → Web App → Execute as: Me → Access: Anyone
 * 4. Copy the URL and paste it into the `proxyUrl` field below
 */

export interface SheetDataSource {
  /** Unique identifier for this source */
  id: string;
  /** Human-readable name */
  name: string;
  /** Google Spreadsheet ID (from the URL) */
  sheetId: string;
  /** Deployed Apps Script Web App URL (preferred method) */
  proxyUrl: string;
  /** Sheet tab name to read (default: first sheet) */
  sheetTab?: string;
  /** Column header → TaskItem field mapping overrides */
  columnMap?: Partial<ColumnMapping>;
  /**
   * How to map tasks to Command Center nodes:
   * - 'auto': use a "System" or "Node" column from the sheet
   * - string: assign all tasks to this specific node ID
   */
  nodeMapping: string;
  /** Whether this source is active */
  enabled: boolean;
  /** Polling interval in milliseconds (default: 5 min) */
  refreshIntervalMs: number;
}

/** Maps spreadsheet column headers → TaskItem fields */
export interface ColumnMapping {
  title: string;
  status: string;
  priority: string;
  assignee: string;
  system: string;
  dueDate: string;
}

/** Default column mapping — handles common header variations */
export const DEFAULT_COLUMN_MAP: ColumnMapping = {
  title: 'Title',
  status: 'Status',
  priority: 'Priority',
  assignee: 'Assignee',
  system: 'System',
  dueDate: 'Due Date',
};

/**
 * Fuzzy header matcher: tries common variations for each field.
 * Used when exact column names don't match the default map.
 */
export const HEADER_ALIASES: Record<keyof ColumnMapping, string[]> = {
  title: ['title', 'task', 'task title', 'task name', 'name', 'description', 'item'],
  status: ['status', 'state', 'progress', 'done', 'complete', 'completed'],
  priority: ['priority', 'prio', 'p', 'urgency', 'importance', 'level'],
  assignee: ['assignee', 'assigned to', 'owner', 'responsible', 'who', 'person', 'agent'],
  system: ['system', 'node', 'component', 'area', 'module', 'category', 'group', 'team'],
  dueDate: ['due date', 'due', 'deadline', 'target date', 'date'],
};

/**
 * Map of human-readable system names → Command Center node IDs.
 * Used when nodeMapping is 'auto' to resolve the "System" column.
 */
export const SYSTEM_TO_NODE_ID: Record<string, string> = {
  // Core systems
  'command center': 'cc',
  'rxfit command center': 'cc',
  'concierge': 'cc',
  'virtual services': 'virtual',
  'virtual': 'virtual',

  // Data layer
  'google drive': 'drive',
  'drive': 'drive',
  'github': 'github',
  'calendar': 'calendar',
  'google calendar': 'calendar',

  // Agentic layer
  'jade': 'jade',
  'jade v3': 'jade',
  'rxfit-mcp': 'jade',
  'antigravity': 'antigravity',
  'wrap-ups': 'wrapups',
  'wrapups': 'wrapups',

  // Communications
  'twilio': 'twilio',
  'google chat': 'gchat',
  'gchat': 'gchat',

  // Finance
  'stripe': 'stripe',
  'billing': 'billing-engine',
  'billing sync': 'billing-engine',
  'billing engine': 'billing-engine',
  'payroll': 'payroll',

  // Marketing / SEO
  'seo': 'seo',
  'seo agent': 'seo',
  'website': 'website',
  'rxfit.co': 'website',
  'oscar crm': 'oscar',
  'crm': 'oscar',
  'audits': 'audits',
  'weekly audits': 'audits',

  // People
  'exec': 'exec',
  'exec team': 'exec',
  'trainers': 'trainers',
  'clients': 'clients',
};

// ─────────────────────────────────────────────────────────
// DATA SOURCES REGISTRY — ADD NEW LIVING DOCS HERE
// ─────────────────────────────────────────────────────────

export const dataSources: SheetDataSource[] = [
  {
    id: 'master-tasks',
    name: 'Master Task Board',
    sheetId: '1MzjPNs8nt8FxmN9YUkWjNreEsT63MPs2qvfZD7fgnr0',
    proxyUrl: '', // ← PASTE YOUR APPS SCRIPT URL HERE
    sheetTab: 'Sheet1',
    nodeMapping: 'auto',
    enabled: true,
    refreshIntervalMs: 5 * 60 * 1000, // 5 minutes
  },
];

// ─────────────────────────────────────────────────────────
// APPS SCRIPT TEMPLATE — Deploy this in the Google Sheet
// ─────────────────────────────────────────────────────────

export const APPS_SCRIPT_TEMPLATE = `
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = e && e.parameter && e.parameter.sheet ? e.parameter.sheet : null;
  var sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Sheet not found', rows: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ headers: data[0] || [], rows: [], lastUpdated: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0].map(function(h) { return String(h).trim(); });
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Skip completely empty rows
    if (row.every(function(cell) { return cell === '' || cell === null || cell === undefined; })) continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j] !== undefined && row[j] !== null ? String(row[j]).trim() : '';
    }
    rows.push(obj);
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      sheetName: sheet.getName(),
      headers: headers,
      rows: rows,
      rowCount: rows.length,
      lastUpdated: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
