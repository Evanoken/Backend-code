import sql from 'mssql';
import config from '../db/config.js';

//
export const graphing = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const query = `
      SELECT order_date, SUM(quantity * unit_price) AS total_amount
      FROM Orders
      INNER JOIN Order_Items ON Orders.order_id = Order_Items.order_id
      GROUP BY order_date
    `;
    const result = await pool.request().query(query);
    if (!result.recordset[0]) {
      res.status(404).json({ message: 'Error while fetching the record set' });
    } else {
      res.status(200).json({ data: result.recordset });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the sales data' });
  } finally {
    sql.close();
  }
};

export const getOrders = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query('SELECT * FROM Orders');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error while fetching orders:', error);
    res.status(500).json({ error: 'Unable to fetch orders' });
  } finally {
    sql.close();
  }
};


export const createOrder = async (req, res) => {
  try {
    const { date, totalAmount, productIds } = req.body;
    let pool = await sql.connect(config.sql);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const orderRequest = new sql.Request(transaction);
      orderRequest.input('date', sql.Date, date);
      orderRequest.input('totalAmount', sql.Decimal, totalAmount);
      const orderResult = await orderRequest.query('INSERT INTO Orders (date, totalAmount) VALUES (@date, @totalAmount); SELECT SCOPE_IDENTITY() AS orderId');
      const orderId = orderResult.recordset[0].orderId;

      for (const productId of productIds) {
        const orderDetailRequest = new sql.Request(transaction);
        orderDetailRequest.input('orderId', sql.Int, orderId);
        orderDetailRequest.input('productId', sql.Int, productId);
        await orderDetailRequest.query('INSERT INTO OrderDetails (orderId, productId) VALUES (@orderId, @productId)');
      }

      await transaction.commit();
      res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error while creating order:', error);
    res.status(500).json({ error: 'Unable to create order' });
  } finally {
    sql.close();
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    let pool = await sql.connect(config.sql);
    const request = pool.request()
      .input('orderId', sql.Int, orderId)
      .query('SELECT * FROM Orders WHERE Order_id = @orderId');

    const order = (await request).recordset[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error while fetching order:', error);
    res.status(500).json({ error: 'Unable to fetch order' });
  } finally {
    sql.close();
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { date, totalAmount } = req.body;
    let pool = await sql.connect(config.sql);
    const request = pool.request()
      .input('orderId', sql.Int, orderId)
      .input('date', sql.Date, date)
      .input('totalAmount', sql.Decimal, totalAmount)
      .query('UPDATE Orders SET date = @date, totalAmount = @totalAmount WHERE Order_id = @orderId');
      
    const order = (await request).recordset[0];
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error while updating order:', error);
    res.status(500).json({ error: 'Unable to update order' });
  } finally {
    sql.close();
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    let pool = await sql.connect(config.sql);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const deleteOrderRequest = new sql.Request(transaction);
      deleteOrderRequest.input('orderId', sql.Int, orderId);
      await deleteOrderRequest.query('DELETE FROM Orders WHERE Order_id = @orderId');

      const deleteOrderDetailsRequest = new sql.Request(transaction);
      deleteOrderDetailsRequest.input('orderId', sql.Int, orderId);
      await deleteOrderDetailsRequest.query('DELETE FROM OrderDetails WHERE Order_id = @orderId');

      await transaction.commit();
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error while deleting order:', error);
    res.status(500).json({ error: 'Unable to delete order' });
  } finally {
    sql.close();
  }
};

