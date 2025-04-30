import React, { useEffect, useState } from 'react';
import axios from 'axios';

const emptyBanner = { name: '', imageUrl: '', link: '', order: 0, isActive: true };

const SponsorBannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyBanner);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data } = await axios.get('/api/sponsor-banners');
    setBanners(data);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put('/api/sponsor-banners', { _id: editingId, ...form });
    } else {
      await axios.post('/api/sponsor-banners', form);
    }
    setForm(emptyBanner);
    setEditingId(null);
    fetchBanners();
  };

  const handleEdit = banner => {
    setForm(banner);
    setEditingId(banner._id);
  };

  const handleDelete = async id => {
    await axios.delete('/api/sponsor-banners', { data: { _id: id } });
    fetchBanners();
  };

  return (
    <div>
      <h2>Gestion des bandes publicitaires sponsors</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL de l'image" required />
        <input name="link" value={form.link} onChange={handleChange} placeholder="Lien (optionnel)" />
        <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="Ordre" />
        <label>
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} /> Actif
        </label>
        <button type="submit">{editingId ? 'Modifier' : 'Ajouter'}</button>
        {editingId && <button type="button" onClick={() => { setForm(emptyBanner); setEditingId(null); }}>Annuler</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Image</th>
            <th>Lien</th>
            <th>Ordre</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map(b => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td><img src={b.imageUrl} alt={b.name} style={{ maxHeight: 40 }} /></td>
              <td>{b.link}</td>
              <td>{b.order}</td>
              <td>{b.isActive ? 'Oui' : 'Non'}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Éditer</button>
                <button onClick={() => handleDelete(b._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SponsorBannerAdmin;
