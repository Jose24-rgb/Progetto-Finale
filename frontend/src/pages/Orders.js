import { useEffect, useState } from 'react';
import axios from '../services/apis';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/orders/${user.user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Errore nel recupero degli ordini:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.user.id]);

  if (loading) return <p>Caricamento ordini...</p>;

  return (
    <div className="container mt-5">
      <h2>📦 I miei ordini</h2>
      {orders.length === 0 ? (
        <p>Non hai ancora effettuato ordini.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID Ordine</th>
                <th>Data</th>
                <th>Totale</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>€ {order.total.toFixed(2)}</td>
                  <td>{order.status || 'pagato'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;

