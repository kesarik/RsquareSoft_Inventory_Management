# CLAUDE.md — Smart IT Asset & Office Facility Management System

This file gives Claude Code full context on the project: what it is, how it is structured, what conventions to follow, and how to run it locally.

---

## Project Overview

A centralized web application replacing Excel-based manual tracking of IT assets and office facility inventory. Supports asset allocation to employees, return workflows, and stock monitoring.

**Demo scope:** Modules 1–3 only (Asset Inventory, Facility Inventory, Employee Allocation). Tickets, maintenance, RBAC, and analytics are out of scope for now.

---

## Tech Stack

- **Frontend:** React 18 + Vite, React Query, React Router v6, Axios
- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic v2
- **ORM:** SQLAlchemy 2.x (async), Alembic for migrations
- **Database:** PostgreSQL 15 on AWS RDS (shared remote instance — no local Postgres, no Docker)
- **Events:** FastAPI `BackgroundTasks` for async side-effects
- **Runtime:** Uvicorn running locally on each dev machine — no containerization, no cloud deploy yet

---

## Repo Structure

```
smart-asset-mgmt/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app init + router registration
│   │   ├── database.py              # SQLAlchemy engine, session, Base
│   │   ├── config.py                # pydantic-settings — reads from .env
│   │   │
│   │   ├── models/                  # M — SQLAlchemy ORM models (DB table definitions)
│   │   │   ├── __init__.py
│   │   │   ├── asset.py             # IT_assets table
│   │   │   ├── facility.py          # facility_items table
│   │   │   ├── employee.py          # employees table
│   │   │   ├── allocation.py        # asset_allocations table
│   │   │   ├── category.py          # categories table
│   │   │   └── vendor.py            # vendors table
│   │   │
│   │   ├── controllers/             # C — Business logic; called by views, calls models
│   │   │   ├── __init__.py
│   │   │   ├── asset_controller.py
│   │   │   ├── facility_controller.py
│   │   │   ├── employee_controller.py
│   │   │   ├── allocation_controller.py
│   │   │   ├── category_controller.py
│   │   │   └── vendor_controller.py
│   │   │
│   │   ├── views/                   # V — FastAPI routers (HTTP layer only, no logic)
│   │   │   ├── __init__.py
│   │   │   ├── asset_view.py
│   │   │   ├── facility_view.py
│   │   │   ├── employee_view.py
│   │   │   ├── allocation_view.py
│   │   │   ├── category_view.py
│   │   │   └── vendor_view.py
│   │   │
│   │   └── schemas/                 # Pydantic request/response schemas (shared by V + C)
│   │       ├── __init__.py
│   │       ├── asset.py
│   │       ├── facility.py
│   │       ├── employee.py
│   │       ├── allocation.py
│   │       ├── category.py
│   │       └── vendor.py
│   │
│   ├── alembic/
│   │   └── versions/
│   ├── alembic.ini
│   ├── .env                         # Never commit — use .env.example as template
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── models/                  # M — JS data shapes / TypeScript types (API response types)
│   │   │   ├── asset.js
│   │   │   ├── facility.js
│   │   │   ├── employee.js
│   │   │   └── allocation.js
│   │   │
│   │   ├── controllers/             # C — React Query hooks + API call functions (data logic)
│   │   │   ├── api/                 # Axios client + raw API functions
│   │   │   │   ├── client.js        # Axios base instance (baseURL, headers, interceptors)
│   │   │   │   ├── assetApi.js
│   │   │   │   ├── facilityApi.js
│   │   │   │   ├── employeeApi.js
│   │   │   │   └── allocationApi.js
│   │   │   └── hooks/               # React Query hooks (useAssets, useCreateAsset, etc.)
│   │   │       ├── useAssets.js
│   │   │       ├── useFacility.js
│   │   │       ├── useEmployees.js
│   │   │       └── useAllocations.js
│   │   │
│   │   ├── views/                   # V — React pages and reusable UI components
│   │   │   ├── pages/
│   │   │   │   ├── Assets/
│   │   │   │   │   ├── AssetList.jsx
│   │   │   │   │   ├── AssetDetail.jsx
│   │   │   │   │   └── AssetForm.jsx
│   │   │   │   ├── Facility/
│   │   │   │   │   ├── FacilityList.jsx
│   │   │   │   │   └── FacilityForm.jsx
│   │   │   │   ├── Employees/
│   │   │   │   │   ├── EmployeeList.jsx
│   │   │   │   │   └── EmployeeDetail.jsx
│   │   │   │   └── Allocations/
│   │   │   │       ├── AllocationList.jsx
│   │   │   │       └── AllocationForm.jsx
│   │   │   └── components/          # Shared stateless UI components
│   │   │       ├── Navbar.jsx
│   │   │       ├── Table.jsx
│   │   │       ├── Badge.jsx
│   │   │       └── ConfirmDialog.jsx
│   │   │
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

### MVC mapping

| MVC layer | Backend | Frontend |
|---|---|---|
| Model | `app/models/` — SQLAlchemy table classes | `src/models/` — JS type definitions |
| View | `app/views/` — FastAPI routers (HTTP in/out only) | `src/views/` — React pages + components |
| Controller | `app/controllers/` — business logic, DB queries | `src/controllers/` — React Query hooks + Axios API calls |

---

## Database Schema

### Enums

```python
# asset_status
Available | Allocated | Under Maintenance | Damaged | Scrap | Replaced

# asset_condition
New | Good | Fair | Poor

# category_type
IT | Facility
```

### Tables & Relationships

```text
categories        id, name, type(category_type), description, created_at, is_active
vendors           id, name, contact_person, email, phone, address, gst_no, is_active
it_assets         id, category_id→categories, vendor_id→vendors,
                  model_name, serial_number(unique), purchase_date, warranty_expiry,
                  status(asset_status), condition(asset_condition), specifications(jsonb)
facility_items    id, category_id→categories, item_name, total_quantity,
                  available_quantity, low_stock_threshold, unit
employees         id, emp_id(unique), full_name, email(unique), department, designation, 
                  join_date, role, is_active
asset_allocations id, asset_id→it_assets, employee_id→employees, allocation_date,
                  actual_return_date, digital_ack_status, remarks
                  ```

**Key relationship rule:** When an allocation is created, `assets.status` must flip to `Allocated`. On return (`actual_return_date` set), it flips back to `Available`. This logic lives in `allocation_controller.py`, not the view or DB.

---

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/assets` | List assets — supports `?status=`, `?category_id=` filters |
| POST | `/assets` | Create asset — auto-generate `asset_tag` |
| GET | `/assets/{id}` | Asset detail |
| PUT | `/assets/{id}` | Update asset |
| DELETE | `/assets/{id}` | Delete asset |
| GET | `/facility` | List facility items |
| POST | `/facility` | Create facility item |
| PUT | `/facility/{id}` | Update stock or item details |
| GET | `/employees` | List employees |
| POST | `/employees` | Create employee |
| GET | `/employees/{id}` | Employee detail + current allocations |
| GET | `/allocations` | List all allocations |
| POST | `/allocations` | Allocate asset to employee |
| PUT | `/allocations/{id}/return` | Record asset return |
| GET | `/allocations/employee/{emp_id}` | All allocations for an employee |
| GET | `/categories` | List categories |
| POST | `/categories` | Create category |
| GET | `/vendors` | List vendors |
| POST | `/vendors` | Create vendor |

All routes return JSON. Errors use standard HTTP status codes with `{"detail": "..."}` bodies.

---

## Coding Conventions

### Backend (Python / FastAPI)

- **Views** (`app/views/`) handle HTTP only: parse request, call controller, return response. No business logic, no direct DB access.
- **Controllers** (`app/controllers/`) own all business logic and DB interactions. Import and use `AsyncSession`.
- **Models** (`app/models/`) define SQLAlchemy ORM classes. Each file maps to one domain. Define `__tablename__` and all relationships explicitly.
- **Schemas** (`app/schemas/`) use Pydantic v2. Separate `Create`, `Update`, and `Response` schemas per model — shared between views and controllers.
- Use `async`/`await` throughout — async SQLAlchemy sessions only.
- All DB sessions via dependency injection: `db: AsyncSession = Depends(get_db)`.
- Asset tag format: `IT-YYYY-NNN` (e.g. `IT-2024-001`) — generation logic in `asset_controller.py`.
- Employee ID format: `EMP` + 4-digit number (e.g. `EMP1001`).
- Environment config via `pydantic-settings` in `config.py` — never hardcode connection strings.
- Return `404` with a clear message when a record is not found.
- Return `409` when a unique constraint would be violated (duplicate `serial_number`, etc.).

### Frontend (React)

- **Views** (`src/views/`) are React pages and components — no direct API calls. They consume hooks from `controllers/hooks/`.
- **Controllers** (`src/controllers/`) own all data logic: Axios API functions in `api/` and React Query hooks in `hooks/`.
- **Models** (`src/models/`) define JS object shapes / TypeScript interfaces matching API response structures.
- All API calls go through `src/controllers/api/` — never call `axios` directly from a page or component.
- Server state managed by React Query hooks — no `useEffect` for data fetching.
- Local UI state only via `useState` / `useReducer`.
- Components in `src/views/components/` are stateless and reusable — no API calls or hooks inside them.
- Use React Router `<Link>` for navigation, not `window.location`.

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+
- Access to the shared AWS RDS instance (get credentials from team lead)

### Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env template and fill in RDS credentials
cp .env.example .env
# Edit .env — set DATABASE_URL to the RDS endpoint (see below)

# Run migrations against RDS
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| Redoc | http://localhost:8000/redoc |
| Database | AWS RDS — connect via `DATABASE_URL` in `.env` |

### Common commands

```bash
# Create a new migration after model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1

# Install a new Python dependency
pip install <package> && pip freeze > requirements.txt

# Run backend tests
pytest backend/tests/

# Build frontend
cd frontend && npm run build
```

> **Important:** Everyone on the team connects to the same AWS RDS instance. Run `alembic upgrade head` before starting work after a pull — a teammate may have added migrations.

---

## Environment Variables

```env
# backend/.env  — never commit this file
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<rds-endpoint>:5432/asset_mgmt
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173
```

Get `<user>`, `<password>`, and `<rds-endpoint>` from the team lead. The RDS instance is shared across all developers — use the same DB, same schema.

---

## Out of Scope (Do Not Build Yet)

These features are planned post-demo. Do not scaffold, stub, or reference them unless explicitly asked:

- Issue & ticket management
- Maintenance scheduling and repair history
- Dashboard analytics and charts
- Role-based access control (RBAC) and user auth
- Email notifications (AWS SES)
- Audit logging
- Multi-branch / multi-office support
- Export to Excel / PDF reports
- AI-based maintenance prediction
- Multi-branch / multi-office support
- AWS Lambda / API Gateway deployment
- Email notifications (AWS SES)