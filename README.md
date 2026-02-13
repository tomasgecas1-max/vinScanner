<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Q6sPHj-oYXc1LxXN84cA3wFXO0DXTEv-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set environment variables in `.env` or `.env.local`:
   - `GEMINI_API_KEY` – Gemini API key (optional; used for AI chat and fallback report generation)
   - `ONE_AUTO_API_KEY` – [One Auto API](https://www.oneautoapi.com) key (optional; when set, VIN check uses One Auto API)
   - `ONE_AUTO_VEHICLE_IDENTITY_ONLY=true` – (optional) use only [Vehicle Identity](https://www.oneautoapi.com/service/aeb5d6f0-5590-494d-a375-b2fa033e5ed1/); skips Service History and VIN Lookup to avoid the ~2.5 EUR per report cost when those are disabled in your plan
3. Run the app:
   `npm run dev`
