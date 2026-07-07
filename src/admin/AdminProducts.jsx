import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

// These must match the enum in server/models/Product.js (all lowercase)
const CATEGORIES = ['skincare', 'bodycare', 'haircare', 'makeup', 'wellness', 'sets', 'hybrid'];

const CATEGORY_LABELS = {
  skincare: 'Skincare',
  bodycare: 'Bodycare',
  haircare: 'Haircare',
  makeup: 'Makeup',
  wellness: 'Wellness',
  sets: 'Sets',
  hybrid: 'Hybrid',
};

const emptyForm = {
  name: '', price: '', description: '', category: 'skincare',
  image: '', subtitle: '', countInStock: '100',
};

const AdminProducts = () => {
  const { API } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Add / Edit Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      if (res.data.success) setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.price || !form.category) {
      setFormError('Name, price and category are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.post('/products', {
        ...form,
        category: form.category.toLowerCase(),   // always send lowercase
        price: Number(form.price),
        countInStock: Number(form.countInStock) || 100,
      });
      if (res.data.success) {
        setProducts(prev => [res.data.product, ...prev]);
        setForm(emptyForm);
        setShowAddForm(false);
        showToast(`"${res.data.product.name}" added successfully`);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (p) => {
    setEditProduct(p);
    setEditForm({
      name: p.name || '',
      price: p.price || '',
      description: p.description || '',
      category: p.category || 'skincare',
      image: p.image || '',
      subtitle: p.subtitle || '',
      countInStock: p.countInStock !== undefined ? String(p.countInStock) : '100',
    });
    setShowAddForm(false); // Close add form if open
    setFormError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!editForm.name.trim() || !editForm.price || !editForm.category) {
      setFormError('Name, price and category are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.put(`/products/${editProduct._id}`, {
        ...editForm,
        category: editForm.category.toLowerCase(),
        price: Number(editForm.price),
        countInStock: Number(editForm.countInStock) || 0,
      });
      if (res.data.success) {
        setProducts(prev =>
          prev.map(p => p._id === editProduct._id ? res.data.product : p)
        );
        setEditProduct(null);
        showToast(`"${res.data.product.name}" updated successfully`);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await API.delete(`/products/${id}`);
      if (res.data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        showToast('Product removed successfully');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className="ad-products-page">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#56876D' : '#e53e3e',
          color: '#fff', padding: '12px 20px', borderRadius: '10px',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: '16px', padding: '32px',
            maxWidth: '400px', width: '90%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '8px', color: 'var(--text-dark)' }}>Remove Product?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              This product will be permanently deleted from the catalogue.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)}
                style={{ padding: '10px 24px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#e53e3e', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', opacity: deletingId === confirmId ? 0.7 : 1 }}>
                {deletingId === confirmId ? 'Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="ad-charts-header" style={{ marginBottom: '24px' }}>
        <h1 className="ad-section-title">Products Catalogue ({filtered.length})</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 16px', borderRadius: '10px',
              border: '1.5px solid var(--border)', width: '220px',
              outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            }}
          />
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditProduct(null);
              setForm(emptyForm);
              setFormError('');
            }}
            style={{
              padding: '10px 22px', borderRadius: '10px',
              background: showAddForm ? '#e53e3e' : 'linear-gradient(135deg, #56876D, #3d5a48)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(86,135,109,0.35)',
            }}
          >
            {showAddForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="ad-card" style={{ marginBottom: '24px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: '20px', fontSize: '1.15rem', color: 'var(--text-dark)' }}>
            ✨ Add New Product
          </h2>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Rose Glow Serum' },
                { label: 'Subtitle / Tagline', key: 'subtitle', placeholder: 'e.g. Brightening formula' },
                { label: 'Price (₹) *', key: 'price', placeholder: 'e.g. 1299', type: 'number' },
                { label: 'Stock Quantity', key: 'countInStock', placeholder: '100', type: 'number' },
                { label: 'Image URL', key: 'image', placeholder: 'https://...' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid var(--border)', outline: 'none',
                      fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Description
              </label>
              <textarea
                placeholder="Product description..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
                style={{
                  padding: '10px 14px', borderRadius: '8px',
                  border: '1.5px solid var(--border)', outline: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.88rem', resize: 'vertical',
                }}
              />
            </div>
            {formError && (
              <div style={{ marginTop: '12px', color: '#e53e3e', fontSize: '0.85rem', fontWeight: '600' }}>
                ❌ {formError}
              </div>
            )}
            <div style={{ marginTop: '20px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #56876D, #3d5a48)',
                  color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '0.9rem',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(86,135,109,0.35)',
                }}
              >
                {submitting ? 'Adding Product...' : '✓ Add to Catalogue'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Form */}
      {editProduct && (
        <div className="ad-card" style={{ marginBottom: '24px', padding: '28px', border: '1.5px solid var(--green-mid, #56876D)' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: '20px', fontSize: '1.15rem', color: 'var(--text-dark)' }}>
            ✏️ Edit Product: {editProduct.name}
          </h2>
          <form onSubmit={handleEditSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Rose Glow Serum' },
                { label: 'Subtitle / Tagline', key: 'subtitle', placeholder: 'e.g. Brightening formula' },
                { label: 'Price (₹) *', key: 'price', placeholder: 'e.g. 1299', type: 'number' },
                { label: 'Stock Quantity', key: 'countInStock', placeholder: '100', type: 'number' },
                { label: 'Image URL', key: 'image', placeholder: 'https://...' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={editForm[f.key]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid var(--border)', outline: 'none',
                      fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Category *
                </label>
                <select
                  value={editForm.category}
                  onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Description
              </label>
              <textarea
                placeholder="Product description..."
                value={editForm.description}
                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
                style={{
                  padding: '10px 14px', borderRadius: '8px',
                  border: '1.5px solid var(--border)', outline: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.88rem', resize: 'vertical',
                }}
              />
            </div>
            {formError && (
              <div style={{ marginTop: '12px', color: '#e53e3e', fontSize: '0.85rem', fontWeight: '600' }}>
                ❌ {formError}
              </div>
            )}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #56876D, #3d5a48)',
                  color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: '700', fontSize: '0.9rem',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(86,135,109,0.35)',
                }}
              >
                {submitting ? 'Updating...' : '✓ Update Product'}
              </button>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                style={{
                  padding: '12px 24px', borderRadius: '10px',
                  background: '#f1f5f9', color: '#475569', border: '1.5px solid #cbd5e1',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '600', fontSize: '0.9rem',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="ad-card ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{p.name}</div>
                        {p.subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.subtitle}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="ad-badge ad-badge--purple" style={{ fontSize: '0.75rem' }}>{p.category}</span>
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--green-dark)' }}>₹{p.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`ad-badge ${(p.countInStock ?? 0) > 10 ? 'ad-badge--green' : 'ad-badge--red'}`}>
                      {p.countInStock ?? 0} units
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#d97706', fontWeight: '700' }}>★ {p.rating ?? '—'}</span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleEditClick(p)}
                      style={{
                        background: '#eef2f6', color: '#334155',
                        border: '1.5px solid #cbd5e1', borderRadius: '8px',
                        padding: '6px 14px', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                        fontWeight: '600', marginRight: '8px', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#cbd5e1'; }}
                      onMouseLeave={e => { e.target.style.background = '#eef2f6'; }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setConfirmId(p._id)}
                      style={{
                        background: '#fff0f0', color: '#e53e3e',
                        border: '1.5px solid #fed7d7', borderRadius: '8px',
                        padding: '6px 14px', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                        fontWeight: '600', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.target.style.background = '#e53e3e'; e.target.style.color = '#fff'; }}
                      onMouseLeave={e => { e.target.style.background = '#fff0f0'; e.target.style.color = '#e53e3e'; }}
                    >
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
