# The Headless Enterprise: RxFit Operational Automation

This repository contains an interactive React Flow application that visually maps out the entire infrastructure, data flow, automations, and human interfaces of the **RxFit Headless Enterprise**.

## Context for AI Agents & Developers
If you are an AI reading this repository, this block diagram acts as the architectural source of truth for RxFit's organizational and structural systems. It maps out:
- **Source of Truth Databases:** Google Drive (Sheets/Docs) and GitHub.
- **Client & Admin Interfaces:** RxFit Command Center (Concierge) and Oscar CRM.
- **Communications Layer:** Twilio (for remote execution via Danny's phone and client alerts) and Google Chat (for internal operations).
- **Billing Tri-Pillar Flow:** The relationship between Stripe, Google Calendar, and the Command Center.
- **Agentic Layer:** The roles of RxFit-MCP (JADE v3), Antigravity, and the Morning/EOD Wrap-ups that process infinite context and assign expedient tasks.

This interactive diagram is a local React application built with Vite, TypeScript, and React Flow.

## Installation & Running Locally
```bash
npm install
npm run dev
```
