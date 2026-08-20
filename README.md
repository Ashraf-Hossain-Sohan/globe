# Multi-Company Finance & Operations Management Platform: Comprehensive Project Report

### 1. Project Overview & Client Details
The "Multi-Company Finance & Operations Management Platform" was developed as a software engineering project for the CSE412 course at East West University, under the supervision of Associate Professor Dr. Mohammad Mahdi Hassan[cite: 2]. 
*   **The Client:** The system was commissioned by "365 Frames," represented by client Sourav Basak, located in Bhubaneswar, Odisha, India[cite: 2].
*   **The Problem:** The client previously struggled with scattered business information, manual administration processes that increased effort and inconsistency, delayed business insights, and a lack of secure access control for sensitive data[cite: 2].
*   **Core Objectives:** 
    *   **Centralize Data:** Consolidate financial and operational records across all business entities[cite: 2].
    *   **Reduce Manual Effort:** Automate structured workflows and administrative tasks[cite: 2].
    *   **Business Insights:** Provide timely, organized data to facilitate better decision-making[cite: 2].
    *   **Access Control & Auditability:** Enforce role-based permissions and maintain full system audit logs for reporting and invoicing[cite: 2].

### 2. System Architecture & Technology Stack
To ensure a robust and maintainable system, the team utilized a strict **Layered Architecture** divided into five distinct levels:
1.  **Presentation Layer:** Handles user interface and interactions[cite: 2].
2.  **Controller Layer:** Receives requests and coordinates application flow[cite: 2].
3.  **Service Layer:** Contains application operations and orchestration[cite: 2].
4.  **Core Domain Layer:** Manages core business rules and domain logic[cite: 2].
5.  **Data Access Layer:** Handles communication with persistent data sources[cite: 2].

**Design Patterns:** The architecture incorporates the **Builder Pattern** for constructing complex objects step-by-step and the **Facade Pattern** to simplify interfaces over complex internal subsystems[cite: 2].

**Technology Stack:**
*   **Frontend:** React, TypeScript[cite: 2].
*   **Backend:** Java[cite: 2].
*   **Database:** SQLite[cite: 2].
*   **Development & Deployment:** Antigravity IDE, Git/GitHub, Figma for UI design, JUnit for testing, and Vercel for deployment[cite: 2].
*   **Cross-Cutting Concerns:** Identity verification at every entry point, role-based authorization, and comprehensive audit logging[cite: 2].

### 3. Functional & Non-Functional Scope
*   **Functional Requirements:** The system supports authentication, financial transactions, expense and bill management, inventory tracking, employee and attendance management, invoice generation, financial reporting, and audit logging[cite: 2].
*   **Non-Functional Requirements:** The system was built prioritizing security, reliability, usability, performance, maintainability, and scalability[cite: 2].
*   **UI/UX Capabilities:** The designed dashboard allows group administrators to track metrics such as Total Revenue, Total Expenses, Net Profit, Profit Margin, Inventory Value, Accounts Payable, Monthly Burn Rate, and Working Capital across different companies (e.g., XSRS IT, 365 Frames, EverAfter, PrintDesk)[cite: 2].

### 4. Development Methodology & Team Distribution
The project was executed using an **Agile/Iterative Development Workflow** to ensure continuous feedback, incremental delivery, and early issue detection[cite: 2]. The timeline spanned seven sprints:
*   **Sprint 1 (15 Jun - 21 Jun):** Planning, requirement analysis (SRS), user journey mapping, and low-fidelity wireframing[cite: 2].
*   **Sprint 2 (22 Jun - 28 Jun):** Skeleton UI design for Login/Dashboard, and implementation of core service layer elements[cite: 2].
*   **Sprint 3 (29 Jun - 05 Jul):** Frontend development including Inventory and Bill pages[cite: 2].
*   **Sprint 4 (06 Jul - 12 Jul):** Development of the Overview page, company-specific pages, Settings, and Profile[cite: 2].
*   **Sprint 5 (13 Jul - 19 Jul):** Backend API building for Invoices, Inventory, Bills, and Employee pages[cite: 2].
*   **Sprint 6 (20 Jul - 26 Jul):** Finalizing Reports, Invoices, Employee, and Office Time modules[cite: 2].
*   **Sprint 7 (27 Jul - 09 Aug):** Comprehensive bug fixing and testing[cite: 2].

**Team Workload:**
*   **Ashraf Hossain (Team Lead):** 26 coding hours, 12 non-coding hours (Recorded as 37 Total Hours)[cite: 2].
*   **Tahira Tasnim (Project Analyst):** 23 coding hours, 10.5 non-coding hours (33.5 Total Hours)[cite: 2].
*   **Abdullah Al Rafi (Technical Support):** 20.5 coding hours, 10 non-coding hours (30.5 Total Hours)[cite: 2].

### 5. Testing, Metrics, & Final Delivery
The software underwent a rigorous multi-tiered testing strategy encompassing Functional, Integration, Security/Access, End-to-End, and User Acceptance testing[cite: 2].
*   **Testing Results:** The frontend test suite successfully passed 90 automated tests across 18 files (e.g., Dashboard, Settings, Profile, Auth components), while the backend build succeeded with 252 tests run and zero failures[cite: 2].
*   **Complexity Measurement:** System size and complexity were evaluated using Function Point Analysis. The Unadjusted Function Points (UFP) were calculated as 380 (150 + 0 + 100 + 50 + 80)[cite: 2]. Using a Complexity Adjustment Value (CAV) of 1.05 based on 14 general system characteristics, the final system size was calculated at **399 Function Points** (380 × 1.05)[cite: 2]. 
*   **Outcome:** The project concluded with a successful deployment, delivering a fully centralized, secure, and integrated platform that satisfied the client's core business requirements[cite: 2].
