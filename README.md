# 🛰️ Address Verifier App

A React + Apollo Client project that verifies Australian addresses using **postcode, suburb, and state**.  
It provides a simple UI for validation and displays results on a **Google Map**.  
State is managed with **Zustand**, and the app is fully tested with **Jest + React Testing Library**.  

---

## ✨ Features

- 🔎 **Source Tab**: Fetches and displays data sources via GraphQL.  
- ✅ **Verifier Tab**: Validates a postcode + suburb + state combination.  
- 🗺️ **Google Map integration**: Displays validated locations on a map.  
- 📦 **State management** with Zustand.  
- 🧪 **Unit testing** with Jest + React Testing Library.  
- ⚡ **Turbo** support for monorepo and fast builds.  

---

## 🏗️ Tech Stack

- **React 18** + **TypeScript**  
- **Apollo Client** (GraphQL queries + caching)  
- **Zustand** (lightweight state management)  
- **Google Maps JavaScript API**  
- **Jest** + **React Testing Library** (unit testing)  
- **Swiper.js** (for carousel UI in Source Tab)  
- **Turbo** (for task orchestration and builds)  

---

## 🚀 Getting Started



```bash
 1. Clone repo
    - git clone git@github.com:kcaaashir/Lawpath-Address-App.git
    cd address-verifier

2. Install dependencies

    npm install

3. Set up environment variables

    -Copy the file from env.local.txt and create a new file .env.local and paste it there. Get the Authentication key for Elastic key and Australia post api which is in assessment docs.

4. Start development server

    -npm run dev

5. For testing 
    -npm test
```


