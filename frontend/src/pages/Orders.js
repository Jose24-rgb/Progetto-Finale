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
        const res = await axios.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Errore nel recupero degli ordini:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
                <th>Ordine</th>
                <th>Data</th>
                <th>Totale</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>€ {order.total.toFixed(2)}</td>
                  <td>{order.status}</td>
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
