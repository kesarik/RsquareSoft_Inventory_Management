import { useEffect, useState } from 'react'
import { useCategories } from '../../../controllers/hooks/useCategories'
import { useVendors } from '../../../controllers/hooks/useVendors'
import { useCreateAsset, useUpdateAsset } from '../../../controllers/hooks/useAssets'
import { ASSET_STATUSES, ASSET_CONDITIONS } from '../../../models/asset'
import styles from './AssetForm.module.css'

const EMPTY = {
  model_name: '',
  category_id: '',
  vendor_id: '',
  serial_number: '',
  purchase_date: '',
  warranty_expiry: '',
  status: 'Available',
  condition: 'New',
}

export default function AssetForm({ asset, onClose }) {
  const isEdit = !!asset
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const { data: categories = [] } = useCategories('IT')
  const { data: vendors = [] } = useVendors()

  const createMutation = useCreateAsset()
  const updateMutation = useUpdateAsset()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (asset) {
      setForm({
        model_name: asset.model_name ?? '',
        category_id: asset.category_id ?? '',
        vendor_id: asset.vendor_id ?? '',
        serial_number: asset.serial_number ?? '',
        purchase_date: asset.purchase_date ?? '',
        warranty_expiry: asset.warranty_expiry ?? '',
        status: asset.status ?? 'Available',
        condition: asset.condition ?? 'New',
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
  }, [asset])

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      model_name: form.model_name.trim(),
      category_id: Number(form.category_id),
      vendor_id: Number(form.vendor_id),
      serial_number: form.serial_number.trim(),
      purchase_date: form.purchase_date || null,
      warranty_expiry: form.warranty_expiry || null,
      status: form.status,
      condition: form.condition,
    }

    if (!payload.model_name || !payload.category_id || !payload.vendor_id || !payload.serial_number) {
      setError('Model name, category, vendor, and serial number are required.')
      return
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: asset.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onClose()
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Edit Asset' : 'Add New Asset'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className={styles.body} onSubmit={handleSubmit}>
          {/* Model Name */}
          <div className={styles.field}>
            <label className={styles.label}>Model Name <span className={styles.req}>*</span></label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Dell Latitude 5540"
              value={form.model_name}
              onChange={set('model_name')}
            />
          </div>

          {/* Category + Vendor (2 col) */}
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Category <span className={styles.req}>*</span></label>
              <select className={styles.select} value={form.category_id} onChange={set('category_id')}>
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Vendor <span className={styles.req}>*</span></label>
              <select className={styles.select} value={form.vendor_id} onChange={set('vendor_id')}>
                <option value="">Select vendor…</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Serial Number */}
          <div className={styles.field}>
            <label className={styles.label}>Serial Number <span className={styles.req}>*</span></label>
            <input
              type="text"
              className={`${styles.input} ${styles.mono}`}
              placeholder="e.g. DL-LAT54-2024-001"
              value={form.serial_number}
              onChange={set('serial_number')}
            />
          </div>

          {/* Status + Condition */}
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={form.status} onChange={set('status')}>
                {ASSET_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Condition</label>
              <select className={styles.select} value={form.condition} onChange={set('condition')}>
                {ASSET_CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Purchase Date + Warranty */}
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Purchase Date</label>
              <input
                type="date"
                className={styles.input}
                value={form.purchase_date}
                onChange={set('purchase_date')}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Warranty Expiry</label>
              <input
                type="date"
                className={styles.input}
                value={form.warranty_expiry}
                onChange={set('warranty_expiry')}
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isPending}>
              {isPending ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Asset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
