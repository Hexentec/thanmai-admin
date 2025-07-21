import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../lib/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/pages/OrderDetails.css';


export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('created');
  const [trackingUrl, setTrackingUrl] = useState('');

  // fetch the order on mount
  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => {
        const o = res.data;
        setOrder(o);
        setStatus(o.orderStatus || 'created');
        setTrackingUrl(o.courierTrackingUrl || '');
      })
      .catch(err => console.error('Fetch order failed:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // update order status & trackingUrl
  const handleUpdate = () => {
    api.patch(`/orders/${id}`, { status, trackingUrl })
      .then(res => {
        setOrder(res.data);
        alert('Order updated');
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Failed to update');
      });
  };

  // generate PDF invoice
  const downloadInvoice = () => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Thanmai Home Foods Invoice', 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 32);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 40);

    const rows = (order.items || []).map((it, i) => {
      const price = Number(it.price) || 0;
      const qty   = Number(it.quantity) || 0;
      return [
        i + 1,
        it.product?.name || '–',
        it.variant || '–',
        qty,
        `₹${price.toFixed(2)}`,
        `₹${(price * qty).toFixed(2)}`
      ];
    });

    doc.autoTable({
      startY: 50,
      head: [['#','Product','Variant','Qty','Price','Total']],
      body: rows,
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    const subtotal    = Number(order.subtotal)    || 0;
    const shippingFee = Number(order.shippingFee) || 0;
    const total       = Number(order.total)       || 0;

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, finalY);
    doc.text(`Shipping Fee: ₹${shippingFee.toFixed(2)}`, 14, finalY + 8);
    doc.text(`Total: ₹${total.toFixed(2)}`, 14, finalY + 16);

    doc.save(`invoice_${order._id}.pdf`);
  };

  if (loading) return <p className="loading">Loading…</p>;
  if (!order) return <p className="error">Order not found</p>;

  const d = order.deliveryDetails || {};
  const subtotal    = Number(order.subtotal)    || 0;
  const shippingFee = Number(order.shippingFee) || 0;
  const total       = Number(order.total)       || 0;

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title={`Order #${order._id}`} />
        <div className="content-body">
          <Link to="/admin/orders" className="back-link">
            ← Back to Orders
          </Link>

          <section className="section">
            <h2>Delivery Details</h2>
            <p><strong>Name:</strong> {d.firstName || '–'} {d.lastName || ''}</p>
            <p><strong>Email:</strong> {order.email || '–'}</p>
            <p><strong>Phone:</strong> {d.phoneNumber || '–'}</p>
            <p>
              <strong>Address:</strong> {d.address || '–'}
              {d.apartment ? `, ${d.apartment}` : ''}
              {d.city ? `, ${d.city}` : ''}{d.state ? `, ${d.state}` : ''}
              {d.pinCode ? ` - ${d.pinCode}` : ''}{d.country ? `, ${d.country}` : ''}
            </p>
          </section>

          <section className="section">
            <h2>Order Info</h2>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            <p>
              <strong>Order Status:</strong>{' '}
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {['created','processing','shipped','delivered'].map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </p>
            <p><strong>Tracking URL:</strong>{' '}
              {trackingUrl
                ? <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                    {trackingUrl}
                  </a>
                : 'Not Provided'}
            </p>
          </section>

          <section className="section">
            <h2>Items</h2>
            <table className="items-table">
              <thead>
                <tr>
                  <th>#</th><th>Product</th><th>Variant</th>
                  <th>Qty</th><th>Price</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((it, i) => {
                  const price = Number(it.price) || 0;
                  const qty   = Number(it.quantity) || 0;
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{it.product?.name || '–'}</td>
                      <td>{it.variant || '–'}</td>
                      <td>{qty}</td>
                      <td>₹{price.toFixed(2)}</td>
                      <td>₹{(price * qty).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="section summary">
            <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
            <p><strong>Shipping Fee:</strong> ₹{shippingFee.toFixed(2)}</p>
            <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>
          </section>

          <div className="actions">
            <button className="btn" onClick={handleUpdate}>
              Update Status
            </button>
            <button className="btn download-btn" onClick={downloadInvoice}>
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
