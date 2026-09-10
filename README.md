# About PomoTracker

PomoTracker is a productivity tool build with Tauri. PomoTracker is a personal productivity desktop application built with Tauri. It combines Pomodoro session tracking, productivity analytics, and basic task management in one application.

The app records completed focus sessions and transforms the collected data into graphs and heatmaps, helping users understand their productivity patterns over time.

## Features

### Pomodoro Tracking
- Record completed Pomodoro sessions
- Review historical productivity data

### Productivity Analytics
- Visualize completed sessions through graphs
- View activity patterns through a calendar heatmap

### Todoist Integration
- Access Todoist tasks from the application
- Synchronize task changes with Todoist through the Todoist API

### Data Synchronization
- Store data locally for offline use
- Synchronize local data with a Supabase database
- Support two-way synchronization between local and remote data

## Built With
- Tauri - cross-platform application framework
- React - user interface
- Rust - native application logic
- SQLite - local database
- Supabase - remote database
- Todoist API - task-management integration

## Getting Started
### Prerequisites
- npm
- Rust

### Installation
1. Clone the repo
```
git clone https://github.com/SleepyFeeshy/pomodoro-app-public.git
```
2. Install NPM packages
```
npm install
```
3. Run the project
```
npm run tauri dev
```

## Project Status
PomoTracker is currently a personal project and proof of concept. It was designed for a single user and is not ready for public distribution or production use.
Current limitations include:
- Remote synchronization features commented out for public version
- API credentials are configured locally for personal development
- No complete user authentication or authorization flow
- Synchronization has not been designed or tested for concurrent users
- Setup currently requires manual configuration
