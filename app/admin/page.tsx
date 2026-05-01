'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { translations, Lang } from '@/lib/translations'
import { Offer } from '@/lib/supabase'
import Link from 'next/link'

function AdminContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Lang>((searchParams.get('lang') as Lang) || 'ar')
  const t = translations[lang]

  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [adminPwd, setAdminPwd] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError('')
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoginLoading(false)
    if (data.success) {
      setAuthed(true)
      setAdminPwd(password)
      fetchOffers(password)
    } else {
      setLoginError(t.wrongPassword)
    }
  }

  const fetchOffers = async (pwd?: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (typeFilter !== 'all') params.set('type', typeFilter)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    const res = await fetch('/api/offers?' + params.toString())
    const data = await res.json()
    setOffers(data.offers || [])
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchOffers()
  }, [typeFilter, statusFilter])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/offers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPwd },
      body: JSON.stringify({ status }),
    })
    if (res.ok) fetchOffers()
  }

  const deleteOffer = async (id: string) => {
    if (!confirm(t.confirmDelete)) return
    const res = await fetch(`/api/offers/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPwd },
    })
    if (res.ok) fetchOffers()
  }

  const totalSold = offers.filter(o => o.status === 'sold').length
  const totalAvailable = offers.filter(o => o.status === 'available').length

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const getTypeLabel = (type: string) => t[type as keyof typeof t] as string || type

  // Login screen
  if (!authed) {
    return (
      <div className={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f4a2a, #1a6b3c)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: '#1a6b3c', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>🔐</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>{t.adminDashboard}</h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{t.adminLogin}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 14 }}>{t.password}</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
          </div>
          {loginError && <p style={{ color: '#dc2626', fontSize: 14, marginBottom: 12 }}>{loginError}</p>}
          <button className="btn-primary" style={{ width: '100%', fontSize: 16 }} onClick={handleLogin} disabled={loginLoading}>
            {loginLoading ? '...' : t.login}
          </button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>
              {t.switchLang}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Navbar */}
      <nav style={{ background: '#0f4a2a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, background: '#c8a84b', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔐</div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{t.adminDashboard}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>
              {t.switchLang}
            </button>
            <button onClick={() => { setAuthed(false); setPassword('') }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>
              {t.logout}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: t.totalOffers, value: offers.length, icon: '🎫', bg: '#eff6ff', color: '#1e40af' },
            { label: t.availableOffers, value: totalAvailable, icon: '✅', bg: '#dcfce7', color: '#166534' },
            { label: t.soldOffers, value: totalSold, icon: '💰', bg: '#fee2e2', color: '#991b1b' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: stat.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{stat.icon}</div>
              <div>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 2 }}>{stat.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', marginBottom: 20, border: '1px solid #e5e7eb', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{t.filterBy}:</span>
          {['all', 'graduation', 'honors_first', 'honors_second', 'honors_third'].map(type => (
            <button key={type} className={'filter-tab' + (typeFilter === type ? ' active' : '')} onClick={() => setTypeFilter(type)} style={{ fontSize: 12 }}>
              {type === 'all' ? t.allTypes : getTypeLabel(type)}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px' }} />
          {['all', 'available', 'sold'].map(s => (
            <button key={s} className={'filter-tab' + (statusFilter === s ? ' active' : '')} onClick={() => setStatusFilter(s)} style={{ fontSize: 12 }}>
              {s === 'all' ? t.allStatus : s === 'available' ? t.available : t.sold}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
          ) : offers.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎫</div>
              <p>{t.noOffers}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'البائع' : 'Seller'}</th>
                    <th>{lang === 'ar' ? 'التواصل' : 'Contact'}</th>
                    <th>{t.ticketType}</th>
                    <th>{t.quantity}</th>
                    <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                    <th>{lang === 'ar' ? 'طرق التواصل' : 'Contact Methods'}</th>
                    <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => (
                    <tr key={offer.id}>
                      <td style={{ fontWeight: 600, color: '#1a1a1a' }}>{offer.name}</td>
                      <td>
                        <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
                          <div>📧 {offer.email}</div>
                          <div>📱 {offer.phone}</div>
                        </div>
                      </td>
                      <td>
                        <span style={{ background: '#eff6ff', color: '#1e40af', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5 }}>
                          {getTypeLabel(offer.ticket_type)}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, textAlign: 'center' }}>{offer.quantity}</td>
                      <td style={{ fontWeight: 700, color: '#1a6b3c' }}>{offer.price_sar} {t.sar}</td>
                      <td style={{ fontSize: 12, color: '#6b7280', maxWidth: 180, whiteSpace: 'pre-line' }}>{offer.contact_methods}</td>
                      <td>
                        <span className={'badge-' + offer.status} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 5 }}>
                          {offer.status === 'available' ? t.availableBadge : t.soldBadge}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(offer.created_at)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {offer.status === 'available' ? (
                            <button
                              onClick={() => updateStatus(offer.id, 'sold')}
                              style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}
                            >
                              {t.markSold}
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(offer.id, 'available')}
                              style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}
                            >
                              {t.markAvailable}
                            </button>
                          )}
                          <button
                            onClick={() => deleteOffer(offer.id)}
                            style={{ background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>}>
      <AdminContent />
    </Suspense>
  )
}
