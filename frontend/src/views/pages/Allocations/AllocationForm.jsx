import { useState } from 'react'
import { useEmployees } from '../../../controllers/hooks/useEmployees'
import { useCreateAllocation } from '../../../controllers/hooks/useAllocations'
import styles from './AllocationForm.module.css'

export default function AllocationForm({ asset, onClose }) {
  const [employeeId, setEmployeeId] = useState('')
  const [remarks, setRemarks]       = useState('')
  const [error, setError]           = useState('')

  const { data: employees = [], isPending: loadingEmployees } = useEmployees()
  const createMutation = useCreateAllocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!employeeId) { setError('Please select an employee.'); return }
    setError('')
    try {
      await createMutation.mutateAsync({
        asset_id:    asset.id,
        employee_id: Number(employeeId),
        remarks:     remarks.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err?.response?.data?.detail ?? 'Allocation failed. Please try again.')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Allocate Asset</h2>
            <p className={styles.subtitle}>Assign this asset to an employee</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Asset preview (read-only) */}
        <div className={styles.assetCard}>
          <div className={styles.assetCardTop}>
            <span className={styles.assetTag}>{asset.asset_tag}</span>
            <span className={styles.assetCategory}>{asset.category}</span>
          </div>
          <div className={styles.assetModel}>{asset.model_name}</div>
          <div className={styles.assetSerial}>{asset.serial_number}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label className={styles.label}>
              Assign To <span className={styles.req}>*</span>
            </label>
            <select
              className={styles.select}
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); setError('') }}
              disabled={loadingEmployees}
            >
              <option value="">
                {loadingEmployees ? 'Loading employees…' : 'Select an employee…'}
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.emp_id}){emp.department ? ` — ${emp.department}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Remarks</label>
            <textarea
              className={styles.textarea}
              placeholder="Optional notes about this allocation…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Allocating…' : 'Allocate Asset'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
