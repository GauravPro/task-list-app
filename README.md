# Task List App – Take Home Test

A React Native + Expo app built with TypeScript that replicates the provided Figma "Tasks" screen with add/complete animations, local persistence, and a polished UI.

---

## 🚀 Demo

- **GitHub Repo**: https://github.com/GauravPro/task-list-app
- **Expo Snack Demo**: https://snack.expo.dev/@gauravpro/task-list-app
- **Screen Recording**: Attached in email

---

## 📦 Features

- Greeting header with tab navigation (Tasks functional, others static)
- Add tasks with title, context, and due date
- Task metadata (context label, due date, overdue indicator)
- Smooth completion animation with undo option
- Tasks persisted with AsyncStorage
- Floating Action Button (FAB) for adding tasks
- Polished UI matching Figma prototype

---

## 🛠️ Tech Stack

- React Native (Expo managed workflow)
- TypeScript
- AsyncStorage for local persistence
- Animated API for smooth transitions

---

## ⚙️ Setup & Run Instructions

### Run locally

- npm install
- npx expo start

## Time Log

- Project setup & config: ~15 mins
- Task list + add task UI: ~40 mins
- Animations & undo flow: ~35 mins
- Persistence with AsyncStorage: ~20 mins
- Workflow setup (GitHub Pages): ~30 mins
- Documentation & cleanup: ~20 mins
- Total: ~2.5 hrs

## AI Usage Log

-Used ChatGPT for boilerplate code (task card component, animation snippets)
-Used AI to generate README structure & GitHub Actions workflow
-Adjusted all code manually to meet requirements and match Figma design

## TODOs / Trade-offs

- Add filters (All / Today / Overdue)
- Drag-to-reorder tasks
- Dark/light theme toggle
- Improved accessibility labels
- More detailed date picker (currently free text)
