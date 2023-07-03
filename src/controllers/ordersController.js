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


export const createOrder = async(req, res) => {
  try{
    let pool = await sql.connect(config.sql);
    const {order_date, customer_id, total_amount} = req.body;
    const result = await pool
    .request()
    .input('order_date', order_date)
    .input('customer_id', customer_id)
    .input('total_amount', total_amount)
    .query('INSERT INTO Orders (order_date, customer_id, total_amount) VALUES (@order_date, @customer_id, @total_amount);');
    res.status(201).json({message: 'Order created successfully'});
  } 
  catch (error) {
    console.error('Error while creating order:', error);
    res.status(500).json({ error: 'Unable to create order' });
  }
  finally {
    sql.close();
  }
}


export const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    let pool = await sql.connect(config.sql);
    const request = pool.request()
      .input('order_id', sql.Int, order_id)
      .query('SELECT * FROM Orders WHERE Order_id = @order_id');

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
    const { order_id } = req.params;
    const { date, totalAmount } = req.body;
    let pool = await sql.connect(config.sql);
    const request = pool.request()
      .input('order_id', sql.Int, order_id)
      .input('date', sql.Date, date)
      .input('totalAmount', sql.Decimal, totalAmount)
      .query('UPDATE Orders SET date = @date, totalAmount = @totalAmount WHERE Order_id = @order_id');
      
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
    const { order_id } = req.params;
    let pool = await sql.connect(config.sql);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const deleteOrderRequest = new sql.Request(transaction);
      deleteOrderRequest.input('order_id', sql.Int, order_id);
      await deleteOrderRequest.query('DELETE FROM Orders WHERE Order_id = @order_id');

      const deleteOrderDetailsRequest = new sql.Request(transaction);
      deleteOrderDetailsRequest.input('order_id', sql.Int, order_id);
      await deleteOrderDetailsRequest.query('DELETE FROM OrderDetails WHERE Order_id = @order_id');

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

